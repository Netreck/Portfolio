# Contexto Canônico do Homelab para LLM

**Proprietário:** Gabriel Gonçalves
**Data do snapshot:** 18/09/2026
**Finalidade:** fornecer a uma LLM um contexto confiável e atualizado para atualizar a pagina do homelab no portfolio .

## 1. Instruções para a LLM
 
1. Trate este documento como a fonte de verdade da arquitetura lógica atual.
2. Diferencie sempre:

   * **Arquitetura documentada:** o desenho pretendido e descrito neste arquivo.
   * **Estado efetivo:** aquilo que foi confirmado por comandos, configurações ou observação ao vivo.
3. Não presuma que uma regra de firewall, rota, NAT, ACL ou serviço está funcionando apenas porque aparece na arquitetura.
4. Antes de propor uma alteração de rede, identifique:

   * interface e bridge afetadas;
   * rota padrão atual;
   * risco de perda de acesso;
   * comando de validação;
   * procedimento de rollback.
5. Preserve o acesso ao Proxmox durante qualquer mudança. Alterações em MGMT, pfSense, bridges, rotas ou firewall devem ser tratadas como operações de alto risco operacional.
6. Não reutilize informações da arquitetura antiga listadas na seção **Dados obsoletos**.
7. Não invente IPs, regras ou estados ausentes. Marque a informação como **não confirmada** e solicite o dado ou um comando de verificação.
8. Prefira comandos de diagnóstico que não alterem o sistema antes de sugerir comandos de mudança.

---

## 2. Objetivo do projeto

O homelab é um ambiente pessoal para:

* Hospedar projetos e serviços próprios.
* Estudar virtualização, redes, segurança, observabilidade e automação.
* Praticar Proxmox, pfSense, LXC, WireGuard, Tailscale, reverse proxies e segmentação.
* Manter a maior parte do processamento local.
* Utilizar uma VPS pública pequena e barata somente como ponto de entrada IPv4, pois a conexão residencial utiliza CGNAT.

---

## 3. Visão geral da arquitetura

O ambiente utiliza um único host físico com **Proxmox VE**. O Proxmox hospeda a VM do pfSense e os containers LXC da plataforma.

O **pfSense VM107** é o roteador e firewall central entre as redes internas. As bridges do Proxmox fornecem conectividade de camada 2 e não devem realizar roteamento entre as zonas.

O tráfego público entra por uma VPS com IPv4 público, atravessa um túnel WireGuard e chega a uma zona EDGE isolada. Depois passa pelo pfSense, alcança o Nginx Proxy Manager na DMZ e retorna ao pfSense antes de chegar às aplicações em SERVERS.

O acesso administrativo utiliza Tailscale. O container Tailscale está atualmente na rede **VPNADMIN**, separado das aplicações em SERVERS. O acesso ao Proxmox passa pelo pfSense antes de alcançar MGMT.

---

## 4. Hardware do host

| Componente              | Especificação                                |
| ----------------------- | -------------------------------------------- |
| Placa-mãe               | X99 D4 Atermiter                             |
| CPU                     | Intel Xeon E5-2680 v4, 14 cores e 28 threads |
| Memória                 | 32 GB DDR4 ECC RDIMM, 2 × 16 GB              |
| Armazenamento principal | SSD NVMe M.2 de 512 GB                       |
| GPU                     | NVIDIA GeForce RTX 3070 Ti                   |
| Fonte                   | 750 W                                        |

O ambiente possui apenas um host Proxmox, portanto não há alta disponibilidade física.

---

## 5. Redes e zonas

| Zona         | Bridge Proxmox | Subnet            | Gateway pfSense                   | Função                                                          |
| ------------ | -------------- | ----------------- | --------------------------------- | --------------------------------------------------------------- |
| WAN / LEGACY | `vmbr0`        | `192.168.15.0/24` | IP WAN do pfSense não documentado | Upstream residencial do pfSense                                 |
| DMZ          | `dmznet`       | `10.10.10.0/24`   | `10.10.10.1`                      | Reverse proxy e serviços internos que recebem tráfego publicado |
| SERVERS      | `srvnet`       | `10.10.20.0/24`   | `10.10.20.1`                      | Aplicações, monitoramento e workloads internos                  |
| MGMT         | `mgmtnet`      | `10.10.30.0/24`   | `10.10.30.1`                      | Gerenciamento do Proxmox e serviços de infraestrutura           |
| EDGE         | `edgenet`      | `10.10.40.0/24`   | `10.10.40.1`                      | Entrada WireGuard proveniente da VPS                            |
| VPNADMIN     | `vpnadmin`     | `10.10.50.0/24`   | `10.10.50.1`                      | Acesso administrativo privado por Tailscale                     |

### Regras estruturais

* O pfSense é o único roteador previsto entre as subnets.
* As bridges/VNets do Proxmox são redes de camada 2 independentes.
* Comunicação entre zonas deve atravessar o pfSense.
* Comunicação dentro da mesma subnet pode ocorrer diretamente em camada 2, sujeita ao firewall do host.
* Interfaces administrativas não devem ser publicadas diretamente na internet.
* O host Proxmox possui endereço de gerenciamento somente em MGMT.

---

## 6. Borda pública e WireGuard

### VPS pública

| Item              | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| IPv4 público      | `201.23.79.145`                                        |
| Reverse proxy     | Caddy em Docker                                        |
| Portas públicas   | TCP `80` e `443`                                       |
| WireGuard         | UDP `51822`                                            |
| Overlay WireGuard | `10.255.255.0/30`                                      |
| Função            | Entrada IPv4 mínima para contornar o CGNAT residencial |

### Endpoint local

| Item                   | Valor                                                               |
| ---------------------- | ------------------------------------------------------------------- |
| Container              | CT111 `wg-edge`                                                     |
| Zona                   | EDGE                                                                |
| IP local               | `10.10.40.2`                                                        |
| IP WireGuard conhecido | `10.255.255.2`                                                      |
| Função                 | Terminar o túnel da VPS e encaminhar o tráfego publicado ao pfSense |

### Fluxo público atual

```text
gabriel-goncalves.com
→ VPS pública 201.23.79.145
→ Docker / Caddy :80 e :443
→ WireGuard UDP 51822
→ overlay 10.255.255.0/30
→ CT111 wg-edge / EDGE 10.10.40.2
→ pfSense VM107
→ CT103 Nginx Proxy Manager / DMZ 10.10.10.11
→ pfSense VM107
→ aplicação autorizada / SERVERS 10.10.20.0/24
```

O caminho inclui duas passagens pelo pfSense: EDGE → DMZ e DMZ → SERVERS.

---

## 7. Administração privada

O acesso administrativo utiliza Tailscale e deve entrar pela zona VPNADMIN.

| Item                            | Valor atual           |
| ------------------------------- | --------------------- |
| Container                       | CT113 `tailscale-vpn` |
| Zona atual                      | VPNADMIN              |
| Subnet da zona                  | `10.10.50.0/24`       |
| Gateway esperado                | `10.10.50.1`          |
| IP IPv4 do CT113 em VPNADMIN    | **Não confirmado**    |
| Rotas anunciadas pelo Tailscale | **Não confirmadas**   |
| ACLs do Tailscale               | **Não confirmadas**   |
| SNAT de subnet routes           | **Não confirmado**    |

### Fluxo administrativo atual

```text
Mac / dispositivo administrativo
→ Tailscale
→ CT113 tailscale-vpn / VPNADMIN
→ pfSense VM107
→ MGMT 10.10.30.0/24
→ Proxmox VE 10.10.30.2:8006
```

O CT113 não deve ser tratado como pertencente a SERVERS. O endereço antigo `10.10.20.18` não representa mais a posição atual do container.

---

## 8. Inventário atual

### Host e máquina virtual

| Tipo | ID/nome       | Rede/IP                      | Função                                    | Estado conhecido |
| ---- | ------------- | ---------------------------- | ----------------------------------------- | ---------------- |
| Host | Proxmox VE    | MGMT — `10.10.30.2`          | Virtualização e gerenciamento do ambiente | Ativo            |
| VM   | VM107 pfSense | Interfaces em todas as zonas | Roteador, firewall e gateway entre redes  | Ativa            |

### Containers LXC

| ID    | Nome                | Rede/IP atual                    | Função                                          | Estado conhecido |
| ----- | ------------------- | -------------------------------- | ----------------------------------------------- | ---------------- |
| CT100 | OpenClaw            | SERVERS — `10.10.20.17`          | Workload de aplicação                           | Ativo            |
| CT101 | NetBox              | MGMT — `10.10.30.10`             | Inventário e documentação de rede               | Parado           |
| CT103 | Nginx Proxy Manager | DMZ — `10.10.10.11`              | Reverse proxy interno                           | Ativo            |
| CT104 | Main-Monitor        | SERVERS — `10.10.20.12`          | Grafana, Loki e Prometheus                      | Ativo            |
| CT108 | Portfolio-Prod      | SERVERS — `10.10.20.15`          | Portfólio em produção                           | Ativo            |
| CT109 | Portfolio-Prod-1    | SERVERS — `10.10.20.16`          | Instância adicional do portfólio                | Ativo            |
| CT111 | wg-edge             | EDGE — `10.10.40.2`              | Endpoint WireGuard da VPS                       | Ativo            |
| CT112 | segment-pilot-web   | SERVERS — `10.10.20.10`          | Workload piloto de segmentação                  | Parado           |
| CT113 | tailscale-vpn       | VPNADMIN — IP **não confirmado** | Subnet router e acesso administrativo Tailscale | Ativo            |

### Portas administrativas conhecidas

| Serviço                   | Endereço                                         |
| ------------------------- | ------------------------------------------------ |
| Proxmox Web               | `https://10.10.30.2:8006`                        |
| pfSense Web               | `https://10.10.30.1`                             |
| Nginx Proxy Manager Admin | `http://10.10.10.11:81`                          |
| NetBox                    | IP `10.10.30.10`; porta atual **não confirmada** |
