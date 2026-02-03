// ===== КАЛЬКУЛЯТОР З ПІДТРИМКОЮ ДРОБІВ =====
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.fractionMode = false;
        this.currentFraction = null; // { numerator, denominator }
        this.previousFraction = null;
    }

    // Допоміжні функції для роботи з дробами
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    simplifyFraction(num, den) {
        const divisor = this.gcd(Math.abs(num), Math.abs(den));
        return { numerator: num / divisor, denominator: den / divisor };
    }

    addFractions(f1, f2) {
        const num = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
        const den = f1.denominator * f2.denominator;
        return this.simplifyFraction(num, den);
    }

    subtractFractions(f1, f2) {
        const num = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
        const den = f1.denominator * f2.denominator;
        return this.simplifyFraction(num, den);
    }

    multiplyFractions(f1, f2) {
        const num = f1.numerator * f2.numerator;
        const den = f1.denominator * f2.denominator;
        return this.simplifyFraction(num, den);
    }

    divideFractions(f1, f2) {
        const num = f1.numerator * f2.denominator;
        const den = f1.denominator * f2.numerator;
        return this.simplifyFraction(num, den);
    }

    appendNumber(num) {
        if (this.fractionMode) return;
        
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
        if (this.fractionMode) {
            if (this.currentFraction) {
                this.previousFraction = { ...this.currentFraction };
                this.operator = op;
                this.currentFraction = null;
                this.fractionMode = false;
                this.currentValue = '';
                this.updateDisplay();
            }
            return;
        }

        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operator = op;
        this.shouldResetDisplay = true;
    }

    calculate() {
        if (this.operator === null) return;

        // Якщо працюємо з дробами
        if (this.previousFraction && this.currentFraction) {
            let result;
            switch (this.operator) {
                case '+':
                    result = this.addFractions(this.previousFraction, this.currentFraction);
                    break;
                case '-':
                    result = this.subtractFractions(this.previousFraction, this.currentFraction);
                    break;
                case '*':
                    result = this.multiplyFractions(this.previousFraction, this.currentFraction);
                    break;
                case '/':
                    result = this.divideFractions(this.previousFraction, this.currentFraction);
                    break;
                default:
                    return;
            }
            this.currentFraction = result;
            this.previousFraction = null;
            this.operator = null;
            this.shouldResetDisplay = true;
            this.updateDisplay();
            return;
        }

        // Звичайні числа
        if (this.shouldResetDisplay) return;

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

        // Округлюємо до 10 знаків після коми щоб уникнути помилок точності
        if (typeof result === 'number') {
            result = Math.round(result * 10000000000) / 10000000000;
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
        this.fractionMode = false;
        this.currentFraction = null;
        this.previousFraction = null;
        this.updateDisplay();
    }

    backspace() {
        if (this.shouldResetDisplay) return;
        this.currentValue = this.currentValue.length === 1 ? '0' : this.currentValue.slice(0, -1);
        this.updateDisplay();
    }

    toggleSign() {
        if (this.fractionMode && this.currentFraction) {
            this.currentFraction.numerator *= -1;
        } else {
            const value = parseFloat(this.currentValue);
            this.currentValue = (value * -1).toString();
        }
        this.updateDisplay();
    }

    enterFractionMode() {
        this.fractionMode = true;
        this.currentValue = '';
        this.updateDisplay();
    }

    appendFractionPart(num) {
        if (!this.fractionMode) return;

        if (num === '/') {
            if (this.currentValue && !this.currentValue.includes('/')) {
                this.currentValue += '/';
            }
            return;
        }

        // Обмежимо до 2 цифр для простоти
        if (!this.currentValue.includes('/')) {
            if (this.currentValue.length < 2) {
                this.currentValue += num;
            }
        } else {
            const parts = this.currentValue.split('/');
            if (parts[1].length < 2) {
                this.currentValue += num;
            }
        }

        // Якщо введено чисельник/знаменник
        if (this.currentValue.includes('/')) {
            const parts = this.currentValue.split('/');
            if (parts[0] && parts[1]) {
                const num = parseInt(parts[0]);
                const den = parseInt(parts[1]);
                if (den !== 0) {
                    this.currentFraction = { numerator: num, denominator: den };
                }
            }
        }

        this.updateDisplay();
    }

    exitFractionMode() {
        if (this.currentFraction) {
            const decimal = (this.currentFraction.numerator / this.currentFraction.denominator).toFixed(4);
            this.currentValue = decimal;
            this.fractionMode = false;
            this.shouldResetDisplay = true;
            this.updateDisplay();
        } else {
            this.fractionMode = false;
        }
    }

    updateDisplay() {
        let displayText = '';

        if (this.fractionMode) {
            if (this.currentFraction) {
                const decimal = (this.currentFraction.numerator / this.currentFraction.denominator).toFixed(4);
                displayText = `${this.currentFraction.numerator}/${this.currentFraction.denominator} = ${decimal}`;
            } else {
                displayText = this.currentValue || '?/?';
            }
        } else if (this.previousFraction || this.currentFraction) {
            // Показуємо операцію з дробами
            if (this.previousFraction && this.operator) {
                const prevText = `${this.previousFraction.numerator}/${this.previousFraction.denominator}`;
                const currText = this.currentFraction ? 
                    `${this.currentFraction.numerator}/${this.currentFraction.denominator}` : 
                    this.currentValue;
                const opSymbol = this.operator === '÷' ? '÷' : 
                                this.operator === '*' ? '×' : 
                                this.operator === '-' ? '−' : '+';
                displayText = `${prevText} ${opSymbol} ${currText}`;
            } else if (this.currentFraction) {
                const decimal = (this.currentFraction.numerator / this.currentFraction.denominator).toFixed(4);
                displayText = `${this.currentFraction.numerator}/${this.currentFraction.denominator} = ${decimal}`;
            } else {
                displayText = this.currentValue;
            }
        } else {
            displayText = this.currentValue;
            if (this.operator !== null) {
                const operatorSymbol = this.operator === '÷' ? '÷' : 
                                       this.operator === '*' ? '×' : 
                                       this.operator === '-' ? '−' : '+';
                displayText = this.previousValue + ' ' + operatorSymbol + ' ' + this.currentValue;
            }
        }

        this.display.textContent = displayText;
    }
}

// Ініціалізація калькулятора
const calc = new Calculator();
