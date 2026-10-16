package com.taskgo.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository repository;
    private final PedidoRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository repository, PedidoRepository pedidoRepository) {
        this.repository = repository;
        this.pedidoRepository = pedidoRepository;
    }

    @PostMapping("/registrar")
    public Usuario registrar(@RequestBody Usuario usuario) {
        if (repository.existsByEmail(usuario.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginData) {
        if (loginData == null || loginData.getEmail() == null || loginData.getEmail().isBlank()
                || loginData.getSenha() == null || loginData.getSenha().isBlank()) {
            return ResponseEntity.badRequest().body("Informe o e-mail e a senha.");
        }

        Usuario usuario = repository.findByEmailIgnoreCase(loginData.getEmail().trim()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado");
        }

        if (usuario.getSenha() == null || !passwordEncoder.matches(loginData.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
        }

        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/conta")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void excluirConta(@RequestBody ExcluirContaRequest request) {
        if (request == null || request.email() == null || request.email().isBlank()
                || request.senha() == null || request.senha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o e-mail e a senha da conta.");
        }

        Usuario usuario = repository.findByEmailIgnoreCase(request.email().trim()).orElse(null);
        if (usuario == null) {
            return;
        }

        if (usuario.getSenha() == null || !passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não foi possível confirmar a senha da conta.");
        }

        pedidoRepository.deleteByEmailClienteIgnoreCase(usuario.getEmail());
        repository.delete(usuario);
    }

    public record ExcluirContaRequest(String email, String senha) {}
}
