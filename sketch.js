var dog, happyDog, database, foodS, foodStock
var feedDog
var addFood
var fedTime, lastFed
var foodObj
var changeState, readState
var bedroom, garden, washroom

function preload()
{
  dog=loadImage( "images/dogImg1.png")
  happyDog=loadImage ( "images/dogImg.png")
  bedroom=loadImage("virtual-pet-images/Bed Room.png")
  garden=loadImage("virtual-pet-images/Garden.png")
  washroom=loadImage("virtual-pet-images/Wash Room.png")
  sadDog=loadImage("virtual-pet-images/Lazy.png")
}

function setup() {
  database=firebase.database()
  createCanvas(500,500);
  pet=createSprite(250,300,150,150)
  pet.addImage (dog)
  
  pet.scale=0.15

  foodStock=database.ref('Food');
    foodStock.on("value", readStock)

    foodObj = new Food()

    feed=createButton("Feed The Dog");
    feed.position(630,65);
    feed.mousePressed(feedDog);

    addFood=createButton("Add Food");
    addFood.position(730,65);
    addFood.mousePressed(addFood);

    readState=database.ref('gameState');
    readState.on("value", function(data){
      gameState=data.val()
    });

    fedTime=database.ref('feedTime');
    fedTime.on("value", function(data){
      lastFed=data.val()
    });

    
  
}


function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     pet.remove();
   }else{
    feed.show();
    addFood.show();
    pet.addImage(sadDog);
   }
 
  drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  pet.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}