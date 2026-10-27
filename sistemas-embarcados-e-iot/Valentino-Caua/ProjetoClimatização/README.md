# Sistema de Climatização com Controle Automatizado

## Descrição

Este projeto consiste em um sistema automatizado de climatização desenvolvido com Arduino, capaz de monitorar a temperatura ambiente e, com base nela, controlar a abertura de uma janela (via servo motor) e acionar um sistema de ventilação (motor DC) com velocidade variável. O sistema também exibe as informações em um display LCD 16x2 e indica o status por meio de LEDs.

O projeto está organizado na pasta `ProjetoClimatização/`, contendo o código-fonte, o esquema elétrico e a documentação do projeto.

## Objetivos

- Monitorar a temperatura ambiente utilizando um sensor de temperatura (LM35 - conectado ao pino analógico A0).
- Controlar automaticamente a abertura da janela conforme faixas de temperatura.
- Acionar e controlar a velocidade de uma ventoinha/motor conforme a necessidade de refrigeração.
- Exibir o estado do sistema e a temperatura em tempo real em um LCD 16x2.
- Fornecer indicação visual do status através de LEDs (verde e vermelho).

## Componentes Utilizados

| Componente | Quantidade | Função |
|---|---|---|
| Arduino (UNO ou compatível) | 1 | Microcontrolador principal |
| Sensor de Temperatura LM35 | 1 | Medição da temperatura ambiente (conectado a A0) |
| Servomotor | 1 | Controle de abertura/fechamento da janela (pino digital 9) |
| Motor DC (Ventoinha) | 1 | Sistema de ventilação/auxílio à refrigeração (pino digital 6 com PWM) |
| Display LCD 16x2 com I2C (Adafruit LiquidCrystal) | 1 | Exibição de mensagens e temperatura |
| LED Verde | 1 | Indicação de temperatura baixa/ideal (pino 4) |
| LED Vermelho | 1 | Indicação de temperatura quente/muito quente (pino 3) |
| Resistores, jumpers e protoboard | Conforme montagem | Conexões elétricas |

## Mapeamento de Pinos

| Componente | Pino Arduino | Observação |
|---|---|---|
| LM35 (Temperatura) | A0 | Entrada analógica |
| LED Vermelho | 3 | Saída digital |
| LED Verde | 4 | Saída digital |
| Motor DC (Ventoinha) | 6 | Saída PWM (analogWrite) |
| Servomotor (Janela) | 9 | Saída PWM/controle servo |
| LCD 16x2 I2C | Endereço I2C 0x00 | Controlado via Adafruit_LiquidCrystal |

## Esquemático Elétrico

O esquema elétrico completo do circuito está disponível em:

- `ProjetoClimatização/circuito/circuito.png`

Recomenda-se visualizar esta imagem para a correta realização das conexões.

## Lógica de Funcionamento

O sistema opera com base em faixas de temperatura, tomando decisões automáticas para abrir/fechar a janela e acionar a ventoinha:

| Faixa de Temperatura | Estado da Janela | Ventoinha (Motor) | LEDs | Mensagem no LCD |
|---|---|---|---|---|
| T < 16.0 °C | Fechada (0°) | Desligada (0) | LED Verde: HIGH / LED Vermelho: LOW | "Temp Baixa: " + temperatura |
| 16.0 °C <= T <= 22.0 °C | Aberta parcialmente (45°) | Desligada (0) | LED Verde: HIGH / LED Vermelho: LOW | "Temp Ideal: " + temperatura |
| 22.0 °C < T <= 30.0 °C | Aberta totalmente (90°) | Ligada em velocidade média (PWM 140) | LED Verde: LOW / LED Vermelho: HIGH | "Temp Quente: " + temperatura |
| T > 30.0 °C | Fechada (0°) - Isolamento | Ligada em velocidade máxima (PWM 255) | LED Verde: LOW / LED Vermelho: HIGH | "Muito Quente!: " + temperatura |

A leitura da temperatura é realizada a cada 1,5 segundos. A conversão utilizada considera o LM35: `Temperatura (°C) = ((Leitura * 5.0/1023.0) - 0.5) * 100.0`.

## Código Fonte

O código principal está localizado em:

- `ProjetoClimatização/código/codigo.ino`

### Principais Funções

- `lerTemperatura()`: Realiza a leitura analógica do LM35 e converte para graus Celsius.
- `Lcd(String mensagem, float temperatura)`: Limpa o display, exibe a mensagem na linha superior e a temperatura na linha inferior.
- `setup()`: Inicializa portas, servo motor, display LCD e comunicação serial.
- `loop()`: Avalia a temperatura, aplica a lógica de controle e atualiza atuadores e display.

### Bibliotecas Necessárias

- `Servo.h` - Controle do servomotor
- `Adafruit_LiquidCrystal.h` - Controle do display LCD I2C

Certifique-se de instalar estas bibliotecas na IDE do Arduino (Arduino IDE) através do Gerenciador de Bibliotecas ou manualmente.

## Documentação

Documentação detalhada do projeto, incluindo descrição teórica, objetivos, justificativa e demais informações, está disponível em:

- `ProjetoClimatização/docs/Documentação.pdf`

## Montagem e Execução

1. **Montagem do circuito**: Siga o esquema presente em `ProjetoClimatização/circuito/circuito.png`, conectando todos os componentes conforme o mapeamento de pinos.
2. **Instalação das bibliotecas**: Instale as bibliotecas `Servo` e `Adafruit LiquidCrystal` na Arduino IDE.
3. **Carregamento do código**: Abra `ProjetoClimatização/código/codigo.ino` na Arduino IDE, selecione a placa e porta corretas e faça o upload.
4. **Teste**: Abra o Monitor Serial (9600 baud) para acompanhar as leituras de temperatura. Observe o comportamento da janela, ventoinha, LEDs e LCD conforme a variação de temperatura.

## Autores

Projeto desenvolvido por **Valentino** e **Cauã** como parte das atividades da disciplina de Sistemas Embarcados e IoT (4º BIM).

## Observações

- Em temperaturas muito altas (> 30 °C), o sistema opta por fechar a janela (isolamento) e acionar a ventoinha em velocidade máxima, priorizando a ventilação forçada.
- O LCD é atualizado a cada ciclo, com limpeza da tela para evitar sobreposição de caracteres.
- Os valores de PWM para o motor (140 e 255) podem ser ajustados conforme as características do motor DC utilizado.