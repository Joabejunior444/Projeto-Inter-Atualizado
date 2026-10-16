package com.taskgo.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository repository;

    public PedidoController(PedidoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<PedidoEstimativa>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping("/estimar")
    public PedidoEstimativa estimar(@RequestBody PedidoEstimativa pedido) {
        return repository.save(pedido);
    }
}
