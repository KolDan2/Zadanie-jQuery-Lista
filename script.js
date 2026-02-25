$(document).ready(function() {
    const $lista = $('#listaZakupow');
    const $input = $('#wejscieProduktu');

    function aktualizujStatystyki() {
        const suma = $lista.children('li').length;
        const kupione = $lista.children('li.kupione').length;
        
        $('#licznikSuma').text(suma);
        $('#licznikKupione').text(kupione);
        
        zapiszWLocalStorage();
    }

    function zapiszWLocalStorage() {
        const elementy = [];
        $lista.children('li').each(function() {
            elementy.push({
                tekst: $(this).find('span').first().text(),
                czyKupione: $(this).hasClass('kupione')
            });
        });
        localStorage.setItem('mojaListaZakupow', JSON.stringify(elementy));
    }

    function wczytajZLocalStorage() {
        const dane = localStorage.getItem('mojaListaZakupow');
        if (dane) {
            const elementy = JSON.parse(dane);
            elementy.forEach(produkt => {
                const $li = stworzElement(produkt.tekst);
                if (produkt.czyKupione) {
                    $li.addClass('kupione');
                    $li.find('.pole-wyboru').prop('checked', true);
                }
                $lista.append($li.show());
            });
            aktualizujStatystyki();
        }
    }

    function stworzElement(tekst) {
        const $li = $('<li>')
            .addClass('element-listy')
            .html(`
                <div class="tresc-elementu">
                    <input type="checkbox" class="pole-wyboru">
                    <span>${tekst}</span>
                </div>
                <i class="fas fa-grip-lines uchwyt-sortowania"></i>
            `)
            .hide();

        $li.find('.pole-wyboru').on('change', function() {
            $li.toggleClass('kupione');
            aktualizujStatystyki();
        });

        return $li;
    }

    $('#przyciskDodaj').click(function() {
        let wartosc = $input.val().trim();
        if(wartosc) {
            const $nowyElement = stworzElement(wartosc);
            $lista.append($nowyElement);
            $nowyElement.show(200, function() {
                aktualizujStatystyki();
            });
            $input.val('').focus();
        }
    });

    $('#dodajNaPoczatek').click(function() {
        let wartosc = $input.val().trim();
        if(wartosc) {
            const $nowyElement = stworzElement(wartosc);
            $lista.prepend($nowyElement);
            $nowyElement.show('slide', {direction: 'up'}, 300, function() {
                aktualizujStatystyki();
            });
            $input.val('').focus();
        }
    });

    $('#dodajNaKoniec').click(function() {
        let wartosc = $input.val().trim();
        if(wartosc) {
            const $nowyElement = stworzElement(wartosc);
            $lista.append($nowyElement);
            $nowyElement.show('slide', {direction: 'up'}, 300, function() {
                aktualizujStatystyki();
            });
            $input.val('').focus();
        }
    });

    $('#usunOstatni').on('click', function() {
        const $ostatni = $lista.children('li').last();
        if ($ostatni.length > 0) {
            $ostatni.fadeOut(300, function() {
                $(this).remove();
                aktualizujStatystyki();
            });
        }
    });

    $('#wyczyscWszystko').click(function() {
        if(confirm("Czy na pewno chcesz wyczyścić całą listę?")) {
            $lista.empty();
            aktualizujStatystyki();
        }
    });

    $('#przywrocDemo').click(function() {
        $lista.empty();
        ['Mleko', 'Chleb', 'Masło'].forEach(txt => $lista.append(stworzElement(txt).show()));
        aktualizujStatystyki();
    });

    $lista.on('click', 'span', function() {
        const $span = $(this);
        const $li = $span.closest('li');
        const staryTekst = $span.text();

        $span.fadeOut(200, function() {
            const $poleEdycji = $('<input type="text" class="pole-edycji">').val(staryTekst);
            $span.replaceWith($poleEdycji);
            $poleEdycji.focus();

            $poleEdycji.on('blur keypress', function(e) {
                if (e.type === 'blur' || e.which === 13) {
                    const nowyTekst = $(this).val() || staryTekst;
                    const $nowySpan = $('<span>').text(nowyTekst).hide();
                    $(this).replaceWith($nowySpan);
                    $nowySpan.fadeIn(200);
                    aktualizujStatystyki();
                }
            });
        });

        $('.element-listy').removeClass('aktywny');
        $li.addClass('aktywny');
    });

    $('#wejscieFiltra').on('keyup', function() {
        const szukanaFraza = $(this).val().toLowerCase();
        $lista.find('li').each(function() {
            const tekstProduktu = $(this).find('span').text().toLowerCase();
            $(this).toggle(tekstProduktu.includes(szukanaFraza));
        });
    });

    $('#trybZebra').click(function() {
        $lista.toggleClass('tryb-zebra');
    });

    $('#sortujAlfabetycznie').click(function() {
        const elementy = $lista.children('li').get();
        elementy.sort((a, b) => {
            return $(a).find('span').text().localeCompare($(b).find('span').text());
        });
        $.each(elementy, (i, li) => $lista.append(li));
        zapiszWLocalStorage();
    });

    $lista.on('click', 'li', function(e) {
        if ($(e.target).is('input[type="checkbox"], .uchwyt-sortowania')) return;
        $lista.children('li').removeClass('aktywny');
        $(this).addClass('aktywny');
    });

    $lista.sortable({
        handle: '.uchwyt-sortowania',
        update: aktualizujStatystyki
    });

    wczytajZLocalStorage();
});