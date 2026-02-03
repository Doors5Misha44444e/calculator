// ===== ЗВИЧАЙНИЙ КАЛЬКУЛЯТОР =====
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
    }

    appendNumber(num) {
        if (num === '.' && this.currentValue.includes('.')) return;
        
        if (this.shouldResetDisplay) {
            this.currentValue = num === '.' ? '0.' : num;
            this.shouldResetDisplay = false;
        } else {
            this.currentValue = this.currentValue === '0' && num !== '.' ? num : this.currentValue + num;
        }
        this.updateDisplay();
    }

    appendOperator(op) {
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operator = op;
        this.shouldResetDisplay = true;
    }

    calculate() {
        if (this.operator === null || this.shouldResetDisplay) return;
        
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current === 0 ? 'Помилка' : prev / current;
                break;
            default:
                return;
        }

        this.currentValue = result.toString();
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    backspace() {
        if (this.shouldResetDisplay) return;
        this.currentValue = this.currentValue.length === 1 ? '0' : this.currentValue.slice(0, -1);
        this.updateDisplay();
    }

    updateDisplay() {
        // Показуємо весь приклад
        let displayText = this.currentValue;
        
        if (this.operator !== null) {
            const operatorSymbol = this.operator === '÷' ? '÷' : 
                                   this.operator === '*' ? '×' : 
                                   this.operator === '-' ? '−' : '+';
            displayText = this.previousValue + ' ' + operatorSymbol + ' ' + this.currentValue;
        }
        
        this.display.textContent = displayText;
    }
}

// Ініціалізація калькулятора
const calc = new Calculator();
