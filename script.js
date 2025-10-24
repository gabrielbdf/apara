// Gera um calendário vertical de meses entre duas datas
(() => {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const startYear = 2025, startMonth = 10; // novembro = monthIndex 10 (0-based)
    const endYear = 2026, endMonth = 11; // dezembro = 11

    // Defina feriados como objetos { date: 'YYYY-MM-DD', name: 'Descrição' }.
    // Edite ou adicione datas conforme necessário.
    const HOLIDAYS = [
        // --- 2025 ---
        { date: '2025-11-02', name: 'Finados' }, // Nacional
        { date: '2025-11-04', name: 'Aniversário de São Carlos' }, // Municipal - São Carlos
        { date: '2025-11-15', name: 'Proclamação da República' }, // Nacional
        { date: '2025-11-20', name: 'Consciência Negra' }, // Nacional
        { date: '2025-12-03', name: 'Dia de São Francisco Xavier (Padroeiro de Itaguaí)' }, // Municipal - Itaguaí
        { date: '2025-12-25', name: 'Natal' }, // Nacional

        // --- 2026 ---
        { date: '2026-01-01', name: 'Ano Novo' }, // Nacional
        { date: '2026-01-20', name: 'Dia de São Sebastião (Padroeiro do Rio de Janeiro)' }, // Municipal - Rio de Janeiro
        { date: '2026-01-25', name: 'Aniversário de São Paulo' }, // Municipal - São Paulo
        { date: '2026-02-17', name: 'Carnaval' }, // Nacional (Ponto Facultativo)
        { date: '2026-04-03', name: 'Paixão de Cristo' }, // Nacional
        { date: '2026-04-21', name: 'Tiradentes' }, // Nacional
        { date: '2026-04-23', name: 'Dia de São Jorge' }, // Municipal - Rio de Janeiro
        { date: '2026-05-01', name: 'Dia do Trabalhador' }, // Nacional
        { date: '2026-06-04', name: 'Corpus Christi' }, // Nacional (Ponto Facultativo)
        { date: '2026-07-05', name: 'Aniversário de Itaguaí' }, // Municipal - Itaguaí
        { date: '2026-07-09', name: 'Revolução Constitucionalista' }, // Estadual - SP (Aplica-se a São Paulo e São Carlos)
        { date: '2026-09-07', name: 'Independência do Brasil' }, // Nacional
        { date: '2026-10-12', name: 'Nossa Senhora Aparecida' }, // Nacional
        { date: '2026-11-02', name: 'Finados' }, // Nacional
        { date: '2026-11-04', name: 'Aniversário de São Carlos' }, // Municipal - São Carlos
        { date: '2026-11-15', name: 'Proclamação da República' }, // Nacional
        { date: '2026-11-20', name: 'Consciência Negra' }, // Nacional
        { date: '2026-12-03', name: 'Dia de São Francisco Xavier (Padroeiro de Itaguaí)' }, // Municipal - Itaguaí
        { date: '2026-12-25', name: 'Natal' } // Nacional
    ];
    // Mapa rápido de consulta por data -> nome
    const HOLIDAY_MAP = new Map(HOLIDAYS.map(h => [h.date, h.name]));

    // nomes em pt-BR, começando pela segunda-feira
    const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    function monthId(year, monthIndex) {
        return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    }

    // transform getDay() (0=Dom..6=Sáb) -> index onde 0 = segunda, ... 6 = domingo
    function weekdayIndexFromDate(date) {
        return (date.getDay() + 6) % 7;
    }

    function createMonthCard(year, monthIndex) {
        const monthDiv = document.createElement('section');
        monthDiv.className = 'month';
        monthDiv.setAttribute('aria-labelledby', `m-${monthId(year, monthIndex)}`);

        const header = document.createElement('div');
        header.className = 'month-header';
        const title = document.createElement('h2');
        title.className = 'month-title';
        title.id = `m-${monthId(year, monthIndex)}`;
        title.textContent = `${MONTHS[monthIndex]} ${year}`;
        header.appendChild(title);
        monthDiv.appendChild(header);

        // weekdays
        const wk = document.createElement('div');
        wk.className = 'weekdays';
        WEEKDAYS.forEach((w) => {
            const el = document.createElement('div');
            el.className = 'weekday';
            el.textContent = w;
            el.setAttribute('role', 'columnheader');
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
        for (let i = 0; i < startPad; i++) {
            const e = document.createElement('div');
            e.className = 'empty';
            e.setAttribute('aria-hidden', 'true');
            daysGrid.appendChild(e);
        }

        // dias do mês
        const today = new Date();
        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(year, monthIndex, d);
            const cell = document.createElement('div');
            cell.className = 'day';
            // posição do dia na grade considerando os espaços iniciais
            const position = startPad + (d - 1);
            const weekRow = Math.floor(position / 7); // 0 = primeira semana exibida
            if (weekRow % 2 === 0) cell.classList.add('alt-blue'); else cell.classList.add('alt-red');
            if (dt.toDateString() === today.toDateString()) cell.classList.add('today');
            // criar o elemento do número do dia primeiro (evita usar antes de inicializar)
            const span = document.createElement('span');
            span.textContent = String(d);
            const baseAria = `${d} de ${MONTHS[monthIndex]} de ${year}`;
            span.setAttribute('aria-label', baseAria);
            // marcar feriados (procura por YYYY-MM-DD) e adicionar tooltip/aria
            const isoKey = dt.toISOString().slice(0, 10);
            if (HOLIDAY_MAP.has(isoKey)) {
                const name = HOLIDAY_MAP.get(isoKey);
                cell.classList.add('feriado');
                // adiciona informação acessível e tooltip
                span.setAttribute('title', name);
                span.setAttribute('aria-label', `${baseAria} — ${name}`);
            }
            cell.appendChild(span);
            daysGrid.appendChild(cell);
        }

        monthDiv.appendChild(daysGrid);

        // lista de feriados do mês (se houver)
        const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
        const holidaysThisMonth = HOLIDAYS.filter(h => h.date.startsWith(monthKey));
        if (holidaysThisMonth.length) {
            const foot = document.createElement('div');
            foot.className = 'month-holidays';

            const heading = document.createElement('div');
            heading.className = 'month-holidays-title';
            heading.textContent = 'Feriados';
            foot.appendChild(heading);

            holidaysThisMonth.forEach(h => {
                const item = document.createElement('div');
                item.className = 'holiday-item';
                // dia (últimos 2 chars) + descrição
                const dayLabel = h.date.slice(-2).replace(/^0/, '');
                item.textContent = `${dayLabel} — ${h.name}`;
                item.setAttribute('aria-label', `${h.name} em ${dayLabel} de ${MONTHS[monthIndex]} de ${year}`);
                foot.appendChild(item);
            });

            monthDiv.appendChild(foot);
        }

        return monthDiv;
    }

    // Gera de start a end inclusive
    function generateRange(startY, startM, endY, endM) {
        let y = startY, m = startM;
        const nodes = [];
        while (true) {
            nodes.push(createMonthCard(y, m));
            if (y === endY && m === endM) break;
            m++;
            if (m > 11) { m = 0; y++; }
        }
        return nodes;
    }

    const cards = generateRange(startYear, startMonth, endYear, endMonth);
    cards.forEach(c => calendarEl.appendChild(c));

})();
