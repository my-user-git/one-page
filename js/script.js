$(document).ready(function () {
    // Функция центрирования для слайдера
    function centerSlider($container) {
        var $slider = $container.find('.default-contrast-btn');
        var $afterImage = $container.find('.default-contrast-after');
        var centerPos = $container.width() / 2;

        if (centerPos > 0) {
            $slider.css('left', centerPos);
            $afterImage.css('clip-path', 'inset(0 calc(100% - ' + centerPos + 'px) 0 0)');
        }
    }

    // Функция инициализации слайдеров
    function initSliders($container) {
        $container.find('.default-contrast').each(function () {
            var $sliderContainer = $(this);
            var $slider = $sliderContainer.find('.default-contrast-btn');
            var $afterImage = $sliderContainer.find('.default-contrast-after');

            $slider.off('mousedown touchstart');
            centerSlider($sliderContainer);

            function moveHandler(e) {
                var clientX = e.clientX;
                var leftPos = clientX - $sliderContainer.offset().left;
                leftPos = Math.max(0, Math.min(leftPos, $sliderContainer.width()));

                $slider.css('left', leftPos);
                $afterImage.css('clip-path', 'inset(0 calc(100% - ' + leftPos + 'px) 0 0)');
            }

            function stopHandler() {
                $(document).off('mousemove', moveHandler);
                $(document).off('mouseup', stopHandler);
                $(document).off('touchmove', touchMoveHandler);
                $(document).off('touchend', stopHandler);
            }

            function touchMoveHandler(e) {
                var clientX = e.originalEvent.touches[0].clientX;
                var leftPos = clientX - $sliderContainer.offset().left;
                leftPos = Math.max(0, Math.min(leftPos, $sliderContainer.width()));

                $slider.css('left', leftPos);
                $afterImage.css('clip-path', 'inset(0 calc(100% - ' + leftPos + 'px) 0 0)');
                e.preventDefault();
            }

            $slider.on('mousedown', function (e) {
                e.preventDefault();
                $(document).on('mousemove', moveHandler);
                $(document).on('mouseup', stopHandler);
            });

            $slider.on('touchstart', function (e) {
                e.preventDefault();
                $(document).on('touchmove', touchMoveHandler);
                $(document).on('touchend', stopHandler);
            });
        });
    }

    // Функция для добавления отступа ul
    function adjustTabPadding() {
        var $tabsContent = $('.products__list .tabs-content');
        var $tabsWrap = $tabsContent.find('.tabs-wrap');
        
        if ($tabsWrap.length && $tabsContent.length) {
            var wrapHeight = $tabsWrap.outerHeight();
            
            // Ищем ul внутри .tab-pane
            var $uls = $tabsContent.find('.tab-pane ul');
            
            $uls.each(function() {
                $(this).css('padding-top', wrapHeight + 'px');
            });
        }
    }
    
    // Вызываем функцию
    $(document).ready(function() {
        adjustTabPadding();
        
        // При переключении табов тоже вызываем
        $(document).on('click', '.tabs-nav li', function() {
            setTimeout(adjustTabPadding, 100);
        });
        
        // При ресайзе
        $(window).resize(function() {
            adjustTabPadding();
        });
    });

    // Функция инициализации табов (работает для любых табов на странице)
    function initTabs() {
        $('.tabs-nav').each(function () {
            var $tabsNav = $(this);
            var $tabsContent = $tabsNav.next('.tabs-content');

            if ($tabsContent.length === 0) {
                $tabsContent = $tabsNav.closest('.tabs').find('.tabs-content');
            }

            if ($tabsContent.length === 0) return;

            $tabsNav.find('li').each(function () {
                var $tab = $(this);
                $tab.off('click');

                $tab.on('click', function () {
                    $tabsNav.find('li').removeClass('active');
                    $(this).addClass('active');

                    $tabsContent.find('.tab-pane').removeClass('active');

                    var tabId = $(this).data('tab');
                    $tabsContent.find('#' + tabId).addClass('active');

                    // Переинициализируем слайдеры
                    setTimeout(function () {
                        var $activePane = $tabsContent.find('.tab-pane.active');
                        initSliders($activePane);
                        $activePane.find('.default-contrast').each(function () {
                            centerSlider($(this));
                        });
                        
                        // ВАЖНО: Обновляем отступы при переключении таба
                        adjustTabPadding();
                    }, 50);

                    setTimeout(function () {
                        var $activePane = $tabsContent.find('.tab-pane.active');
                        $activePane.find('.default-contrast').each(function () {
                            centerSlider($(this));
                        });
                        
                        // Ещё раз обновляем отступы для уверенности
                        adjustTabPadding();
                    }, 200);
                });
            });
        });
    }

    // ЗАПУСКАЕМ ВСЕ ФУНКЦИИ
    
    initTabs();
    initSliders($(document));
    
    // ВЫЗЫВАЕМ adjustTabPadding ПРИ ЗАГРУЗКЕ
    adjustTabPadding();

    // При ресайзе обновляем отступы
    $(window).on('resize', function () {
        $('.default-contrast').each(function () {
            centerSlider($(this));
        });
        adjustTabPadding(); // Обновляем отступы при ресайзе
    });

    // После загрузки всех изображений
    $(window).on('load', function () {
        $('.tab-pane.active .default-contrast').each(function () {
            centerSlider($(this));
        });
        adjustTabPadding(); // Обновляем отступы после полной загрузки
    });
});

$(document).ready(function() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        var target = $(this.hash);
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 800);
        }
    });
});