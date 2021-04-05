class Tooltip {
  static instance;

  element;

  onPointerOver = event => {
    const element = event.target.closest('[data-tooltip]'); // Ищется ближайший элемент с data-атрибутом tooltip

    if (element) {
      this.render(element.dataset.tooltip); // Если элемент нашелся, он рендерится
      this.moveTooltip(event); // выполняет первоначальное добавление координат на этот тип

      document.addEventListener('pointermove', this.onMouseMove); // На событие onPointerOver навешивается событие onMouseMove на документ
    }
  };

  onMouseMove = event => { // Каждый раз пересчитываются координаты tooltip, при движении мышки 
    this.moveTooltip(event);
  };

  onPointerOut = () => { 
    this.removeTooltip();
  };

  removeTooltip() { // проверяет, если элемент присутствует, то он:
    if (this.element) {
      this.element.remove(); // удаляется
      this.element = null; // зануляется

      document.removeEventListener('pointermove', this.onMouseMove); // удаляется с документа обработчик события onMouseMove
    }
  }

  constructor() { // Синглтон - если tooltip instance существует, то тогда нужно вернуть его же, а если он еще не проинициализирован, то тогда он проининциализируется
    // Будет вызываться один и тот же объект, если написано в конструкторе, то класс создает один и тот же объект
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initEventListeners() { // Навешиваются события после инициализации
    document.addEventListener('pointerover', this.onPointerOver); 
    document.addEventListener('pointerout', this.onPointerOut); 
  }

  initialize() {
    this.initEventListeners(); // 
  }

  render(html) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = html; // Создается html элемент

    document.body.append(this.element); // Подставляется в body
  }

  moveTooltip(event) {
    const shift = 10; // Чтобы не было наезжания курсора
    const left = event.clientX + shift;
    const top = event.clientY + shift;

    // TODO: Add logic for window borders

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  destroy() { // Удаляет глобальные обработчики (что повешено на документ) и удаляет сам tooltip
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    this.removeTooltip();
  }
}

const tooltip = new Tooltip(); // Возвращается не класс, а сам объект, который потом инициализируется

export default tooltip;
