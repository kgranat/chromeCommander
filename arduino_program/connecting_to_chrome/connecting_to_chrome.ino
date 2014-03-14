#define LED_PIN 13

void setup() {

  Serial.begin(9600);

  pinMode(LED_PIN, OUTPUT);

}

void loop() {

  if (Serial.available()) {
    uint8_t command = Serial.read();

    if (command == '1') {
      digitalWrite(LED_PIN, HIGH);
    } else if (command == '0') {
      digitalWrite(LED_PIN, LOW);
    }

  }

}
