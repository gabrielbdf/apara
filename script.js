// Gera um calendário vertical de meses entre duas datas
(() => {
  const calendarEl = document.getElementById('calendar');
  if(!calendarEl) return;

  const startYear = 2025, startMonth = 10; // novembro = monthIndex 10 (0-based)
  const endYear = 2026, endMonth = 11; // dezembro = 11

  // nomes em pt-BR, começando pela segunda-feira
  const WEEKDAYS = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  function monthId(year, monthIndex){
    return `${year}-${String(monthIndex+1).padStart(2,'0')}`;
  }

  // transform getDay() (0=Dom..6=Sáb) -> index onde 0 = segunda, ... 6 = domingo
  function weekdayIndexFromDate(date){
    return (date.getDay() + 6) % 7;
  }

  function createMonthCard(year, monthIndex){
    const monthDiv = document.createElement('section');
    monthDiv.className = 'month';
    monthDiv.setAttribute('aria-labelledby', `m-${monthId(year,monthIndex)}`);

    const header = document.createElement('div');
    header.className = 'month-header';
    const title = document.createElement('h2');
    title.className = 'month-title';
    title.id = `m-${monthId(year,monthIndex)}`;
    title.textContent = `${MONTHS[monthIndex]} ${year}`;
    header.appendChild(title);
    monthDiv.appendChild(header);

    // weekdays
    const wk = document.createElement('div');
    wk.className = 'weekdays';
    WEEKDAYS.forEach(w => {
      const el = document.createElement('div');
      el.className = 'weekday';
      el.textContent = w;
      el.setAttribute('role','columnheader');
      wk.appendChild(el);
    });
    monthDiv.appendChild(wk);

    const daysGrid = document.createElement('div');
    daysGrid.className = 'days';

    const firstOfMonth = new Date(year, monthIndex, 1);
    const lastOfMonth = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastOfMonth.getDate();

    const startPad = weekdayIndexFromDate(firstOfMonth); // quantos espaços vazios antes do dia 1

    // preencher vazios iniciais
    for(let i=0;i<startPad;i++){
      const e = document.createElement('div');
      e.className = 'empty';
      e.setAttribute('aria-hidden','true');
      daysGrid.appendChild(e);
    }

    // dias do mês
    const today = new Date();
    for(let d=1; d<=daysInMonth; d++){
      const dt = new Date(year, monthIndex, d);
      const cell = document.createElement('div');
      cell.className = 'day';
      if(dt.toDateString() === today.toDateString()) cell.classList.add('today');
      const span = document.createElement('span');
      span.textContent = String(d);
      span.setAttribute('aria-label', `${d} de ${MONTHS[monthIndex]} de ${year}`);
      cell.appendChild(span);
      daysGrid.appendChild(cell);
    }

    monthDiv.appendChild(daysGrid);
    return monthDiv;
  }

  // Gera de start a end inclusive
  function generateRange(startY, startM, endY, endM){
    let y = startY, m = startM;
    const nodes = [];
    while(true){
      nodes.push(createMonthCard(y,m));
      if(y===endY && m===endM) break;
      m++;
      if(m>11){ m=0; y++; }
    }
    return nodes;
  }

  const cards = generateRange(startYear, startMonth, endYear, endMonth);
  cards.forEach(c => calendarEl.appendChild(c));

})();
