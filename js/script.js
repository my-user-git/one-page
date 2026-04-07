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
        $container.find('.default-contrast').each(function() {
            var $sliderContainer = $(this);
            var $slider = $sliderContainer.find('.default-contrast-btn');
            var $afterImage = $sliderContainer.find('.default-contrast-after');
            
            // Удаляем старые обработчики
            $slider.off('mousedown touchstart');
            
            // Устанавливаем начальную позицию
            centerSlider($sliderContainer);
            
            // Функции движения
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
            
            // Обработчики
            $slider.on('mousedown', function(e) {
                e.preventDefault();
                $(document).on('mousemove', moveHandler);
                $(document).on('mouseup', stopHandler);
            });
            
            $slider.on('touchstart', function(e) {
                e.preventDefault();
                $(document).on('touchmove', touchMoveHandler);
                $(document).on('touchend', stopHandler);
            });
        });
    }
    
    // Функция инициализации табов (работает для любых табов на странице)
    function initTabs() {
        // Находим все контейнеры с табами по наличию .tabs-nav и .tabs-content
        $('.tabs-nav').each(function() {
            var $tabsNav = $(this);
            var $tabsContent = $tabsNav.next('.tabs-content');
            
            // Если .tabs-content не является следующим элементом, ищем внутри родителя
            if ($tabsContent.length === 0) {
                $tabsContent = $tabsNav.closest('.tabs').find('.tabs-content');
            }
            
            if ($tabsContent.length === 0) return;
            
            // Обработчики для вкладок
            $tabsNav.find('li').each(function() {
                var $tab = $(this);
                $tab.off('click');
                
                $tab.on('click', function() {
                    // Удаляем active у всех вкладок в этой группе
                    $tabsNav.find('li').removeClass('active');
                    $(this).addClass('active');
                    
                    // Скрываем все панели
                    $tabsContent.find('.tab-pane').removeClass('active');
                    
                    // Показываем выбранную панель
                    var tabId = $(this).data('tab');
                    $tabsContent.find('#' + tabId).addClass('active');
                    
                    // Переинициализируем слайдеры в активной панели
                    setTimeout(function() {
                        var $activePane = $tabsContent.find('.tab-pane.active');
                        initSliders($activePane);
                        $activePane.find('.default-contrast').each(function() {
                            centerSlider($(this));
                        });
                    }, 50);
                    
                    setTimeout(function() {
                        var $activePane = $tabsContent.find('.tab-pane.active');
                        $activePane.find('.default-contrast').each(function() {
                            centerSlider($(this));
                        });
                    }, 200);
                });
            });
        });
    }
    
    // Запускаем инициализацию
    initTabs();
    initSliders($(document));
    
    // При ресайзе
    $(window).on('resize', function() {
        $('.default-contrast').each(function() {
            centerSlider($(this));
        });
    });
    
    // После загрузки всех изображений
    $(window).on('load', function() {
        $('.tab-pane.active .default-contrast').each(function() {
            centerSlider($(this));
        });
    });
});