    // Функция ymaps.ready() будет вызвана, когда
    // загрузятся все компоненты API, а также когда будет готово DOM-дерево.
    //пробные [44.83265785463272,40.41463549808953] , 780, 0, 2 * Math.PI, "geoCollection"
    var precision = 30,
        polygon;
    var collection;
    
    function init(){
        // Создание карты.
        var myMap = new ymaps.Map('map', {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [44.82068594766848,40.401932556195035],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 14,
            type: 'yandex#satellite',
            
        },{
                maxZoom: 16,
                minZoom: 10
        });
        var geoCollection = new ymaps.GeoObjectCollection(null, {
            geodesic: true,
            fill: false,
            strokeColor:["000","c5c5c5"],
            strokeWidth: [21,15],
            strokeOpacity:[0.1,1]
        });
        var inerCollection = new ymaps.GeoObjectCollection(null, {
            geodesic: true,
            fill: true,
            fillColor: "bbbbbb",
            outline: false,
            zIndex: -2
        });
        var centrCollection = new ymaps.GeoObjectCollection(null, {
            geodesic: true,
            fill: true,
            fillColor: "000",
            strokeColor:["000","fff"],
            strokeWidth: [6,4],
            strokeOpacity:[1,1]
        });
        var LineCollection = new ymaps.GeoObjectCollection(null, {
            
            strokeColor: '#000000',
            strokeWidth: 2,
            strokeStyle: 'solid'
        });
        myMap.balloon.open([44.83068782938218,40.404725317691245], "Вспомогательные координаты [44.83068782938218,40.404725317691245]", {
            // Опция: показываем кнопку закрытия.
            closeButton: true
        });
            // вычисляем точки полигона в глобальных координатах в функции 
            // данные для ввода (координаты центра, радиус в метрах, начало в PI, конец в PI)
            function CreateLine(c, r, a, t){
                var zoom = myMap.getZoom();
                var projection = myMap.options.get('projection');
                var pointss = [];
                var center = projection.toGlobalPixels(c,zoom);
                var radius = r / 6; 
                var angle = ((a / 360) * 2 * Math.PI)-Math.PI/2;
                var type = t;
                pointss.push(center);
                
                pointss.push([
                    center[0] + radius * Math.cos(angle),
                    center[1] + radius * Math.sin(angle)
                    ]);
                // переводим глобальные координаты в широту-долготу
                pointss = pointss.map(function (point) {
                return projection.fromGlobalPixels(point, zoom);
                });
                if(type == "shortdash"){
                polygon = new ymaps.Polygon([pointss],{},{
                    strokeStyle: "shortdash"
                });} 
                else {
                polygon = new ymaps.Polygon([pointss],{},{});
                }
                LineCollection.add(polygon);
                }
            
        function CreatePolygon(c=[],r,s,e,t ){
            var zoom = myMap.getZoom();
            var projection = myMap.options.get('projection');
            var points = [];
            var center = projection.toGlobalPixels(c, zoom);
            var radius = r / 6;
            var start = s;
            var end = e  ;
            var type = t;
            var delta = end - start;
            var step = delta / precision;
        
                points.push(center);
            for(var i = 0; i < delta + step; i += step){
                points.push([
                center[0] + radius * Math.cos(start + i),
                center[1] + radius * Math.sin(start + i)
            ]);
            }
            //console.log(points);
            points.push(center);
            // переводим глобальные координаты в широту-долготу
            points = points.map(function (point) {
                    return projection.fromGlobalPixels(point, zoom);
            });
            polygon = new ymaps.Polygon([points],{
            
            },{

            });
            if (type == "geoCollection"){
                geoCollection.add(polygon);
            } else if (type == "inerCollection") {
                inerCollection.add(polygon);
                //Добавляем закрашенную границу к секутору в круге
                console.log(points);
                var startif = points[0],
                    endif = points[points.length-2],
                    linecords =[];
                linecords.push(startif);
                linecords.push(endif);
                console.log(linecords);
                line = new ymaps.Polygon([linecords],{},{
                    strokeColor: 'e1ad01',
                    strokeWidth: 2,
                    strokeStyle: 'solid'
                });
                myMap.geoObjects.add(line);
            
        }}
        //Сбор данных с формы - функция не запускается с данными такого вида 
        // var sa,ea,rad,lat,long;
        // document.querySelector('form').addEventListener('submit', (event) =>{
        //     event.preventDefault();
        //     const form = document.querySelector('form');
        //     sa = (((form.elements.sa.value) / 360) * 2 * Math.PI)-Math.PI/2;
        //     ea = (((form.elements.ea.value) / 360) * 2 * Math.PI)-Math.PI/2;
        //     //ea = -(Math.PI / 2) - Math.PI/6;
        //     rad = Number(form.elements.RadiuS.value);
        //     lat = Number(form.elements.lat.value);
        //     long= Number(form.elements.long.value);
        //     collection = form.elements.type.value;
        //     console.log(lat, long, rad, sa, ea , collection);
        //     CreatePolygon([long,lat],rad,sa,ea,collection);});

        //Запускаем функции по созданию полигона в виде круга без сектора
            CreatePolygon([44.82977166892336,40.38610005829184], 780, Math.PI / 2 + 0.2, 2 * Math.PI, "geoCollection" );
        //Запускаем функцию по созданию полигона в виде полукруга
            CreatePolygon([44.810694835616054,40.37530095129757], 780, Math.PI , 2 * Math.PI, "geoCollection" );
            
            var circle = new ymaps.Circle([[44.82, 40.4], 810], {}, {    });
            
            //рисуем линии от центра
            CreateLine([44.82,40.4], 730, 160);
            CreateLine([44.82977166892336,40.38610005829184], 760, 160);
            CreateLine([44.82977166892336,40.38610005829184], 760, 150, "shortdash");
            CreateLine([44.810694835616054,40.37530095129757], 760, 0);
            
            var centr1 = new ymaps.Circle([[44.82, 40.4], 50],{},{            });
            var centr2 = new ymaps.Circle([[44.82977166892336,40.38610005829184], 50],{},{});
            var centr3 = new ymaps.Circle([[44.810694835616054,40.37530095129757], 50],{},{});
            
            //Рисуем внутренние сектора(Координаты, радиус, угол начало, угол конечный,тип коллекции)
            CreatePolygon([44.82977166892336,40.38610005829184], 780, -(Math.PI / 2) - 0.2,  -(Math.PI / 2 ), "inerCollection");
            CreatePolygon([44.82,40.4], 740, -(Math.PI / 2) - Math.PI/6,  -(Math.PI / 2 ), "inerCollection");
            CreatePolygon([44.810694835616054,40.37530095129757], 780, - 2 *(Math.PI/6) -0.1,  - 2*(Math.PI / 6 ), "inerCollection");
            
            //Рисуем круг в центре
            centrCollection.add(centr1);
            centrCollection.add(centr2);
            centrCollection.add(centr3);

            geoCollection.add(circle);
            
            myMap.geoObjects.add(geoCollection);
            myMap.geoObjects.add(centrCollection);
            myMap.geoObjects.add(LineCollection);
            myMap.geoObjects.add(inerCollection);
            //[44.810694835616054,40.37530095129757] - polukrug


    }
    ymaps.ready(init);