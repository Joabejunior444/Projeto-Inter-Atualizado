package com.taskgo.api;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<PedidoEstimativa, Long> {

    void deleteByEmailClienteIgnoreCase(String emailCliente);
}
