window.onload = function(){
    var canvas = document.createElement('canvas');
    document.getElementById("d").appendChild(canvas).setAttribute('id','canvas');
    document.getElementById("d").style.width = '640px';

    var elid = '#canvas'; //id canvas куда помещаются данные 
    var width = 640; //ширина окна canvas
    var height = 250;//высота окна canvas
    var experience = 0; // опыт героя
    var potions = 3; // количество зелья
    var gold = 100; //количество золото
    var hp = 100; // количество здоровья
    var lvl = 1; //уровень героя
    var currentEvent = 0; //текущее событие
    var eventsSize = 7; // число генерируемых событий в игре!

    (function(elid, width, height, experience, potions, gold, hp, lvl, currentEvent, eventsSize){
        //Подание удара и результат победы или поражения 
        var hit = function(){

            eventsRandom[currentEvent][8]-=lvl*4+6;// количетсво здоровья у монстра, которое отнимается с каждым событием
            if (eventsRandom[currentEvent][8]<=0) {//если здоровье монстра 0 или меньше 0
                alert("Вы уничтожили монстра и получаете "+eventsRandom[currentEvent][10]+" Опыта и "+eventsRandom[currentEvent][11]+" Золото");
                experience += eventsRandom[currentEvent][10]; // Прибаляем опыт
                       gold += eventsRandom[currentEvent][11];// Прибавляем золото
                //Высчитывание уровня из количества опыта через цикл
                while (experience >= lvl*10){
                    experience -= lvl*10;//уменьшаем опыт пока не будет меньше текущего опыта 
                    lvl++; //прибавляем lvl
                    alert("Новый уровень "+lvl+"LVL"); 
                }
                currentEvent++; // следующее событие
                if (currentEvent == eventsSize) alert("Victory!")// Если текущее событие сравнялось с количество шагов, то выигрышь!
            } else {
                hp -= Math.max(0 , eventsRandom[currentEvent][9] - lvl*2 - 1);// Уменьшение здоровья героя уроном монстра - защита героя
                if(hp <= 0) alert("Game Over!")// Если hp меньше и равно 0, то конец игры
            }
        }
    //Использование зелья прибавляется 10hp
    var use = function(){ 
        if(potions > 0){
            potions--;
            hp += 10;
            if(hp > 100)// если здоровья больше 100, то здоровье не изменяется
                hp = 100;
        } 
    }
    var next = function(){ currentEvent++ }// следующее событие

    var battle = ["Атака", "Выпить зелье +10HP", "Пропустить битву", hit, use, next];// Битва и действия
    var canvas = document.querySelector(elid);//выбрать элемент canvas
    var rectangleCanvas=canvas.getContext("2d");// Задаем прямоугольную область canvas
    canvas.width = width; //Ширина области
    canvas.height = height;//Длина области

    var eventsRandom=[];
    //Объект описывает варианты событий 
    var versionsEvents=[
            [    "Лавка", 
                 "Услуги мастера", 
                 "Купить зелье 20 золотых", 
                 "Полное HP 100 золотых", 
                 "Выйти",
                 function(){ //При покупке зелья, уменьшается золото
                    if(gold >= 20){
                        gold -= 20;
                        potions ++;
                     } 
                 },
                 function(){ //При восстановлении здоровья, уменьшается золото
                    if(gold >= 100){
                        gold -= 100;
                        hp = 100;
                    } 
                 }, 
                 next 
            ],
            ["Скелет", "Мрак и холод на кладбище, на пути встречается древний воин!"].concat(battle,70,15,25,100),
            ["Огр", "Болотистые места, запах сырости и туман. Везде разбросаны кости живности и людей! Огр охраняет награбленные сокровища!"].concat(battle,50,10,15,70),
            ["Паук", "В поисках Посоха невоспримчивости в пещере - слышу шипение и ядовитый запах паутины большого паука!"].concat(battle,20,6,7,30),
            ["Дракон", "Внезапно из пещеры вылетает дракон!","Атакует","Выпить зелье +10HP","-",hit,use,100,300,25,100,1000 ] 
        ];
        
        var q =  versionsEvents.length-1;
       
        for (var i=0; i<eventsSize-1; i++)
            //Наполнение массива рандомно первые q элементов от [0,q]
            eventsRandom.push(versionsEvents[Math.floor(Math.random()*q)].slice(0));//массив будет начинаться с 0 индекса , не включая 0
            //console.log(versionsEvents);

        eventsRandom.push(versionsEvents[q].slice(0));//Добавляем последний элемент
        //Выполнение функции каждые 100мс
        var game = setInterval(function(){

            rectangleCanvas.clearRect(0,0,width,height);
            rectangleCanvas.fillText("РПГ",10,15);
            rectangleCanvas.fillText("LVL "+lvl+"n  HP "+hp+"/100  Опыт "+experience+"/"+lvl*10+"  Атака "+(lvl*4+6)+"  Защита "+(lvl*2+1)+"  Золото $"+gold+"  Зелья "+potions,10,30);
            //Вывод имени события
            for (var i=0; i < eventsSize; i++){ 
                rectangleCanvas.fillText((i == eventsSize - 1 || i <= currentEvent) ? eventsRandom[i][0] : "??", i*75+15, 70);
            }

            rectangleCanvas.fillText("@",currentEvent*70+5,70);
            rectangleCanvas.fillText(eventsRandom[currentEvent][1],10,100);
            
            if (eventsRandom[currentEvent].length>8) 
                rectangleCanvas.fillText("HP Врага "+eventsRandom[currentEvent][8],150,200);
            
            for (var i=0; i<3; i++) {
                rectangleCanvas.strokeRect(i*160+5,130,150,20);//Рисуем прямоугольники и размещаем их друг за другом
                rectangleCanvas.fillText(eventsRandom[currentEvent][i+2],i*160+10,143);//Заполняем прямоугольники текстом
            }
        }, 100);
        //Событие на клик по прямоугольным кнопкам
        document.addEventListener('click', function(e){
            if (hp > 0)
                for (var i=0; i<3; i++)
                    if (i*160+5 <= e.pageX && e.pageX < i*160+115 && 130 <= e.pageY && e.pageY < 150)// Событие находится в области прямоугольнике, координатах
                        eventsRandom[currentEvent][i+5](); //При попадании на в область вызывается текущее событие
        }, false);
    })(elid, width, height, experience, potions, gold, hp, lvl, currentEvent, eventsSize);//Вызов анонимной функции - function expression
}