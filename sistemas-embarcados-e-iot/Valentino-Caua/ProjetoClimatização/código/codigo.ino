#include <Servo.h>
#include <Adafruit_LiquidCrystal.h>

#define WHITE 0x7

const int PIN_TEMP = A0;
const int PIN_LED_VERM = 3;
const int PIN_LED_VERDE = 4;
const int PIN_MOTOR = 6;
const int PIN_SERVO = 9;

Servo janela;
Adafruit_LiquidCrystal lcd(0);

void setup() {
  Serial.begin(9600);
  pinMode(PIN_LED_VERDE, OUTPUT);
  pinMode(PIN_LED_VERM, OUTPUT);
  pinMode(PIN_MOTOR, OUTPUT);
  
  janela.attach(PIN_SERVO);
  janela.write(0);
  
  // Inicialização correta do LCD
  lcd.begin(16, 2);       
  lcd.setBacklight(1);     
}

float lerTemperatura() {
  int leitura = analogRead(PIN_TEMP);
  float tensao = leitura * (5.0 / 1023.0);
  return (tensao - 0.5) * 100.0;
}

void Lcd(String mensagem, float temperatura) {
  lcd.clear();          // Limpa a tela para evitar resíduos de textos anteriores
  lcd.setCursor(0, 0);  // Posiciona no início da linha 0
  lcd.print(mensagem);
  lcd.setCursor(0, 1);  // Move para a linha 1 para mostrar o valor
  lcd.print(temperatura);
}

void loop() {
  float temp = lerTemperatura();
  
  Serial.print("Temp: ");
  Serial.println(temp);
  
  if (temp < 16.0) {
    janela.write(0); // fechada
    analogWrite(PIN_MOTOR, 0);
    digitalWrite(PIN_LED_VERDE, HIGH);
    digitalWrite(PIN_LED_VERM, LOW);
    Lcd("Temp Baixa: ", temp);
  }
  else if (temp <= 22.0) {
    janela.write(45); // aberta parcialmente
    analogWrite(PIN_MOTOR, 0);
    digitalWrite(PIN_LED_VERDE, HIGH);
    digitalWrite(PIN_LED_VERM, LOW);
    Lcd("Temp Ideal: ", temp);
  }
  else if (temp <= 30.0) {
    janela.write(90); // aberta totalmente
    analogWrite(PIN_MOTOR, 140); // velocidade média
    digitalWrite(PIN_LED_VERDE, LOW);
    digitalWrite(PIN_LED_VERM, HIGH);
    Lcd("Temp Quente: ", temp);
  }
  else {
    janela.write(0); // fechada (isola)
    analogWrite(PIN_MOTOR, 255); // velocidade máxima
    digitalWrite(PIN_LED_VERDE, LOW);
    digitalWrite(PIN_LED_VERM, HIGH);
    Lcd("Muito Quente!: ", temp);
  }
  
  delay(1500);
}