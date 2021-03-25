export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    link = '',
    value = 0
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.render();
  }
  
  chartHeight = 50;

  update() {
    const newColumnChart = document.querySelector('column-chart__chart');
    newColumnChart.innerHTML = this.getColumns;
  };

  getColumns(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;
      
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  };

  render() {
    const element = document.createElement('div'); // (*)
    
    element.innerHTML = `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.value}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this.getColumns(this.data)}
        </div>
      </div>
    </div>
    `;
    
    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;

    if (this.data.length === 0) {
      element.innerHTML = `<img src="./charts-skeleton.svg">`
    }
  }
    
    remove () {
      this.element.remove();
    }
    
    destroy() {
      this.remove();
        // NOTE: удаляем обработчики событий, если они есть
    }
  }
