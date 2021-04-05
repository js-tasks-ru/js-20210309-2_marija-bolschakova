export default class ColumnChart {
  subElements = {};
  chartHeight = 50;

  constructor({
    label = '',
    link = '',
    url = '',
    range = {
      from: new Date('2020-04-06'),
      to: new Date('2020-05-06'),
    },
    formatHeading = value => value,
    value = null,
  } = {}) {
    this.label = label;
    this.link = link;
    this.url = url;
    this.range = range;
    this.formatHeading = formatHeading;
    this.value = value;
    
    this.render();
    this.loadChartData();
  }


  async loadChartData() {
    this.element.classList.add('column-chart_loading');
    const url = new URL(`https://course-js.javascript.ru/${this.url}`);
    url.searchParams.set('from', this.range.from.toISOString());
    url.searchParams.set('to', this.range.to.toISOString());

    try {
      const response = await fetch(url);
      const data = await response.json();
      const values = Object.values(data).reduce((acc, value) => acc + value, 0);
      this.subElements.header.innerText = this.formatHeading(values);
      this.subElements.body.innerHTML = this.getColumns(Object.values(data));
      this.element.classList.remove('column-chart_loading');
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }

  getColumns(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0);

      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            Total ${this.label}
            ${this.getLink()}
          </div>
          <div class="column-chart__container">
             <div data-element="header" class="column-chart__header">
             ${this.value}</div>
            <div data-element="body" class="column-chart__chart">
            </div>
          </div>
        </div>
      `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  async update(dateFrom, dateTo) {
    this.range.from = dateFrom;
    this.range.to = dateTo;
    await this.loadChartData();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
