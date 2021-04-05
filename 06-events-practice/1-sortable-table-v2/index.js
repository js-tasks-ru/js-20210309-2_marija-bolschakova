export default class SortableTable {
  element;
  subElements = {};

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]'); // Из элемента, на котором произошло события с помощью метода пытаемся найти элемент с data-атрибутом sortable=true
    // Происходит событие, у которого есть свойство target, в этом свойстве target находится тот элемент, на котором событие произошло 

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const {
        id,
        order
      } = column.dataset; // из data-атрибутов той колонки, где произошел клик, берутся id и order. 
      const sortedData = this.sortData(id, toggleOrder(order)); // Вызывается метод sortData, вернет отсротированные данные и второй аоргумент объект, который меняет asc на desc
      const arrow = column.querySelector('.sortable-table__sort-arrow'); // Ищется стрелка, которая находится в колокне

      column.dataset.order = toggleOrder(order); // Поменялся порядок с asc на desc и наоборот

      if (!arrow) {
        column.append(this.subElements.arrow);
      } // Если нет стрелки на текущей колонке, то в эту колонку подставляется в текущий элемент с помощью переноса (append)

      this.subElements.body.innerHTML = this.getTableRows(sortedData); // Вставляется новый столбец
    }
  };

  constructor(header = [], {
    data = [],
    sorted = { // Объект, по которому происходит первоначальная сортировка
      id: header.find(item => item.sortable).id, // Находится первый элемент, у которого есть атрибут sortable = true, и сразу берется id этого элемента
      order: 'asc'
    }
  } = {}) {
    this.header = header;
    this.data = data;
    this.sorted = sorted;
    this.render();
    this.initEventListeners();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">${this.header.map(item => this.getHeaderRow(item)).join('')}</div>`;
  }

  getHeaderRow({
    id,
    title,
    sortable,
  }) { //Деструктуризация = item.id, item.title, item.sortable
    const order = this.sorted.id === id ? this.sorted.order : 'asc';
    return `
            <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
              <span>${title}</span>
              ${this.getSortArrowSpan(id)}
            </div>
          `;
  }

  getSortArrowSpan(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist ?
      `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>` :
      '';
  }

  getTableRow(item) {
    const cells = this.header.map(({
      id,
      template
    }) => {
      return {
        id,
        template
      };
    });

    return cells.map(({
      id,
      template
    }) => {
      return template ?
        template(item[id]) :
        `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTableRows(data) {
    return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item, data)}
      </div>`).join('');
  }

  getTableBody() {
    return `
            <div data-element="body" class="sortable-table__body">
              ${this.getTableRows(this.data)}
            </div>`;
  }

  getTable(data) {
    return `
            <div class="sortable-table">
              ${this.getTableHeader()}
              ${this.getTableBody(data)}
            </div>`;
  }

  render() {
    const {
      id,
      order
    } = this.sorted;
    const wrapper = document.createElement('div'); 

    const sortedData = this.sortData(id, order); // Сортируется сразу, передаются id и order, которые передаются из объекта sortData

    wrapper.innerHTML = this.getTable(sortedData);
    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements(element);
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  } // Шаблон делегирования (для экономии обработчиков), обработчик событий навешивается на весь хедер, а затем внутри обработчика смотрится, в какое место попал клик
  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  sortData(id, order) {
    const arr = [...this.data];
    const column = this.header.find(item => item.id === id);
    const {
      sortType
    } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[id] - b[id]);
        case 'string':
          return direction * a[id].localeCompare(b[id], ['ru', 'en']);
        default:
          return direction * (a[id] - b[id]);
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
    this.subElements = {};
  }
}
