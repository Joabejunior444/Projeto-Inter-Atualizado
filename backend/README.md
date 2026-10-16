# TaskGO API

API Spring Boot 3 para salvar pedidos de estimativa no PostgreSQL.

## Configuração

Crie o banco `taskgo_db` no PostgreSQL e configure a senha na variável de ambiente `DB_PASSWORD`. O `application.properties` usa `sua_senha` como fallback local; troque esse valor ou defina a variável antes de iniciar.

No PowerShell:

```powershell
$env:DB_PASSWORD = "sua senha do PostgreSQL"
mvn spring-boot:run
```

É necessário ter o Maven instalado globalmente para executar esse comando.

## Endpoint

`POST http://localhost:8080/api/pedidos/estimar`

Exemplo de JSON:

```json
{
  "servico": "Instalação de câmeras",
  "distancia": "10 km",
  "emailCliente": "cliente@exemplo.com"
}
```
