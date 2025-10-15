// Funciones compartidas para la aplicación Land Cruiser 84

// Sistema de notificaciones
class NotificationSystem {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-xl shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' :
            type === 'error' ? 'bg-red-600 text-white' :
            type === 'warning' ? 'bg-yellow-600 text-white' :
            'bg-blue-600 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
}

// Sistema de historial de mantenimiento
class MaintenanceHistory {
    static saveRecord(record) {
        const history = this.getHistory();
        record.id = Date.now();
        record.timestamp = new Date().toISOString();
        history.push(record);
        localStorage.setItem('landcruiser-maintenance-history', JSON.stringify(history));
    }
    
    static getHistory() {
        const saved = localStorage.getItem('landcruiser-maintenance-history');
        return saved ? JSON.parse(saved) : [];
    }
    
    static getLastServiceDate() {
        const history = this.getHistory();
        if (history.length === 0) return null;
        return new Date(Math.max(...history.map(record => new Date(record.timestamp))));
    }
    
    static getNextServiceDue() {
        const lastService = this.getLastServiceDate();
        if (!lastService) return new Date();
        
        const nextService = new Date(lastService);
        nextService.setMonth(nextService.getMonth() + 6); // Cada 6 meses
        return nextService;
    }
}

// Calculadora de costos de restauración
class RestorationCalculator {
    static calculateTotalCost(items) {
        const baseCosts = {
            engine: { min: 2000, max: 8000 },
            transmission: { min: 1500, max: 5000 },
            suspension: { min: 1000, max: 3000 },
            brakes: { min: 800, max: 2500 },
            electrical: { min: 500, max: 2000 },
            body: { min: 3000, max: 12000 },
            paint: { min: 2000, max: 8000 },
            interior: { min: 1500, max: 6000 },
            tires: { min: 800, max: 2000 },
            misc: { min: 1000, max: 4000 }
        };
        
        let totalMin = 0;
        let totalMax = 0;
        
        items.forEach(item => {
            if (baseCosts[item]) {
                totalMin += baseCosts[item].min;
                totalMax += baseCosts[item].max;
            }
        });
        
        return { min: totalMin, max: totalMax };
    }
    
    static formatCost(cost) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(cost);
    }
}

// Sistema de recordatorios
class ReminderSystem {
    static setReminder(type, interval, message) {
        const reminders = this.getReminders();
        const reminder = {
            id: Date.now(),
            type,
            interval, // en días
            message,
            lastTriggered: null,
            nextTrigger: this.calculateNextTrigger(interval)
        };
        
        reminders.push(reminder);
        localStorage.setItem('landcruiser-reminders', JSON.stringify(reminders));
    }
    
    static getReminders() {
        const saved = localStorage.getItem('landcruiser-reminders');
        return saved ? JSON.parse(saved) : [];
    }
    
    static calculateNextTrigger(interval) {
        const next = new Date();
        next.setDate(next.getDate() + interval);
        return next.toISOString();
    }
    
    static checkReminders() {
        const reminders = this.getReminders();
        const now = new Date();
        
        reminders.forEach(reminder => {
            const nextTrigger = new Date(reminder.nextTrigger);
            if (now >= nextTrigger) {
                this.triggerReminder(reminder);
                this.updateReminder(reminder);
            }
        });
    }
    
    static triggerReminder(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Land Cruiser 84 - Recordatorio', {
                body: reminder.message,
                icon: '/favicon.ico'
            });
        } else {
            NotificationSystem.show(reminder.message, 'warning', 5000);
        }
    }
    
    static updateReminder(reminder) {
        const reminders = this.getReminders();
        const index = reminders.findIndex(r => r.id === reminder.id);
        if (index !== -1) {
            reminders[index].lastTriggered = new Date().toISOString();
            reminders[index].nextTrigger = this.calculateNextTrigger(reminder.interval);
            localStorage.setItem('landcruiser-reminders', JSON.stringify(reminders));
        }
    }
}

// Sistema de comunidad y tips
class CommunityTips {
    static tips = [
        {
            category: 'engine',
            title: 'Cambio de Aceite',
            content: 'Cambia el aceite cada 5000km o 6 meses para mantener el motor en óptimas condiciones. Usa aceite 20W-50 para climas cálidos.',
            difficulty: 'easy',
            time: '30 minutos'
        },
        {
            category: 'transmission',
            title: 'Ajuste de Embrague',
            content: 'Verifica la holgura del embrague cada 10000km. Debe tener entre 10-15mm de recorrido en el pedal.',
            difficulty: 'medium',
            time: '45 minutos'
        },
        {
            category: 'electrical',
            title: 'Mantenimiento de Batería',
            content: 'Limpia las terminales de la batería con bicarbonato y agua para prevenir corrosión. Aplica grasa dielectrica.',
            difficulty: 'easy',
            time: '15 minutos'
        },
        {
            category: 'suspension',
            title: 'Revisión de Ballestas',
            content: 'Inspecciona las ballestas por grietas o deformaciones. La holgura entre hojas no debe exceder 5mm.',
            difficulty: 'medium',
            time: '1 hora'
        },
        {
            category: 'body',
            title: 'Protección contra Óxido',
            content: 'Aplica cera protectora en las zonas propensas a oxidación, especialmente en el chasis y bordes de puertas.',
            difficulty: 'easy',
            time: '2 horas'
        },
        {
            category: 'engine',
            title: 'Sincronización de Carburador',
            content: 'Ajusta la sincronización del carburador cada 20000km para optimar el consumo y performance.',
            difficulty: 'hard',
            time: '2-3 horas'
        }
    ];
    
    static getRandomTip() {
        return this.tips[Math.floor(Math.random() * this.tips.length)];
    }
    
    static getTipsByCategory(category) {
        return this.tips.filter(tip => tip.category === category);
    }
    
    static getTipsByDifficulty(difficulty) {
        return this.tips.filter(tip => tip.difficulty === difficulty);
    }
}

// Utilidades generales
class Utils {
    static formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }
    
    static formatNumber(number) {
        return new Intl.NumberFormat('es-ES').format(number);
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Inicialización global
document.addEventListener('DOMContentLoaded', function() {
    // Solicitar permisos de notificación
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Verificar recordatorios cada hora
    setInterval(() => {
        ReminderSystem.checkReminders();
    }, 3600000); // 1 hora
    
    // Verificar recordatorios al cargar la página
    ReminderSystem.checkReminders();
    
    // Mostrar tip aleatorio
    const randomTip = CommunityTips.getRandomTip();
    if (randomTip && Math.random() < 0.3) { // 30% de probabilidad
        setTimeout(() => {
            NotificationSystem.show(`💡 Tip: ${randomTip.title} - ${randomTip.content}`, 'info', 6000);
        }, 2000);
    }
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NotificationSystem,
        MaintenanceHistory,
        RestorationCalculator,
        ReminderSystem,
        CommunityTips,
        Utils
    };
}