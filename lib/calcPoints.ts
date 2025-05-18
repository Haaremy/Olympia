// lib/calculatePoints.ts

export interface PointsInput {
  game: number;
  field: number;
  userPoints: number;
  multiplier: number;
}

export interface PointsResult {
  result: number;
}

/**
 * Beispiel: Summiert alle Punkte und gibt die Differenz zwischen User1 und User2 zurück.
 */
export function calculatePoints({ game, userPoints, multiplier, field }: PointsInput): number {
  let result = 0;

  ////////////////////////////
  if (game==1){
    if(field==1 && userPoints==5){
      result=10;
    }
    if(field==2 && userPoints==6){
      result=10;
    }
    if(field==3 && userPoints==20){
      result=10;
    }
    if(field==4 && userPoints==8){
      result=10;
    }
  }
  //////////////////////////
////////////////////////////
  if (game==2){
    if(field==1 && userPoints==14){
      result=10;
    }
    if(field==2 && userPoints==9){
      result=10;
    }
    if(field==3 && userPoints==1){
      result=10;
    }
    if(field==4 && userPoints==3){
      result=10;
    }
  }
  ////////////////////////////
  ////////////////////////////
  if (game==3){
    result=userPoints;
  }
  ////////////////////////////
  ////////////////////////////[70, 216, 201, 110]
  if (game==4){
    if(field==1 && userPoints==70){
      result=10;
    }
    if(field==2 && userPoints==216){
      result=10;
    }
    if(field==3 && userPoints==201){
      result=10;
    }
    if(field==4 && userPoints==110){
      result=10;
    }
  }
  ////////////////////////////
  ////////////////////////////    [1, 1, 1, 1]
  if (game==5){
    if(field==1 && userPoints==1){
      result=10;
    }
    if(field==2 && userPoints==1){
      result=10;
    }
    if(field==3 && userPoints==1){
      result=10;
    }
    if(field==4 && userPoints==1){
      result=10;
    }
  }
  ////////////////////////////
  ////////////////////////////
  if (game==6){
    result=userPoints*2*multiplier;
  }
  //////////////////////////// Spiel auf Zeit in Sekunden
  //////////////////////////// [9, 9.5, 10, 10.5, 11, 12, 13, 15, 17, 20]
  if (game==7){
    if(userPoints<20){
      result=1;
    }
    if(userPoints<17){
      result=2;
    }
    if(userPoints<15){
      result=3;
    }
    if(userPoints<13){
      result=4;
    }
    if(userPoints<12){
      result=5;
    }
    if(userPoints<11){
      result=6;
    }
    if(userPoints<10){
      result=7;
    }
    if(userPoints<9){
      result=8;
    }
    if(userPoints<8){
      result=9;
    }
    if(userPoints<7){
      result=10;
    }
  }
//////////////////////////// Schätzen mit Abweichung
////////////////////////////[72, 3534, 99, 115]
  if (game==8){
    let check = 0;
    if(field=1){check = 72;}
    if(field=2){check = 3534;}
    if(field=3){check = 99;}
    if(field=4){check = 115;}
    if(userPoints<userPoints+check*0.9 && userPoints>userPoints-check*0.9){
      result = 1;
    }
    if(userPoints<userPoints+check*0.8 && userPoints>userPoints-check*0.8){
      result = 2;
    }
    if(userPoints<userPoints+check*0.7 && userPoints>userPoints-check*0.7){
      result = 3;
    }
    if(userPoints<userPoints+check*0.6 && userPoints>userPoints-check*0.6){
      result = 4;
    }
    if(userPoints<userPoints+check*0.5 && userPoints>userPoints-check*0.5){
      result = 5;
    }
    if(userPoints<userPoints+check*0.4 && userPoints>userPoints-check*0.4){
      result = 6;
    }
    if(userPoints<userPoints+check*0.3 && userPoints>userPoints-check*0.3){
      result = 7;
    }
    if(userPoints<userPoints+check*0.2 && userPoints>userPoints-check*0.2){
      result = 8;
    }
    if(userPoints<userPoints+check*0.1 && userPoints>userPoints-check*0.1){
      result = 9;
    }
    if(userPoints=check){
      result = 10;
    }
  }
////////////////////////////
////////////////////////////
    if (game==9){
    result=userPoints*2*multiplier;
  }
  ////////////////////////////
  ////////////////////////////[15, 26, 37, 49]
    if (game==10){
    if(field==1 && userPoints==15){
      result=10;
    }
    if(field==2 && userPoints==26){
      result=10;
    }
    if(field==3 && userPoints==37){
      result=10;
    }
    if(field==4 && userPoints==49){
      result=10;
    }
  }
  ////////////////////////////
  ////////////////////////////
    if (game==11){
    result=userPoints*multiplier;
  }
  ////////////////////////////
  ////////////////////////////
    if (game==12){
    result=userPoints*multiplier;
  }
  ////////////////////////////
  ////////////////////////////
    if (game==13){
     let check = 0;
    if(field=1){check = 8;}
    if(field=2){check = 12;}
    if(field=3){check = 15;}
    if(field=4){check = 12;}
    if(userPoints<userPoints+check*0.9 && userPoints>userPoints-check*0.9){
      result = 1;
    }
    if(userPoints<userPoints+check*0.8 && userPoints>userPoints-check*0.8){
      result = 2;
    }
    if(userPoints<userPoints+check*0.7 && userPoints>userPoints-check*0.7){
      result = 3;
    }
    if(userPoints<userPoints+check*0.6 && userPoints>userPoints-check*0.6){
      result = 4;
    }
    if(userPoints<userPoints+check*0.5 && userPoints>userPoints-check*0.5){
      result = 5;
    }
    if(userPoints<userPoints+check*0.4 && userPoints>userPoints-check*0.4){
      result = 6;
    }
    if(userPoints<userPoints+check*0.3 && userPoints>userPoints-check*0.3){
      result = 7;
    }
    if(userPoints<userPoints+check*0.2 && userPoints>userPoints-check*0.2){
      result = 8;
    }
    if(userPoints<userPoints+check*0.1 && userPoints>userPoints-check*0.1){
      result = 9;
    }
    if(userPoints=check){
      result = 10;
    }
  }
  ////////////////////////////
  ////////////////////////////
    if (game==14){
        result=userPoints*5*multiplier;

  }
  ////////////////////////////
  ////////////////////////////
    if (game==15){
        result=userPoints*multiplier;
  }
  ////////////////////////////
  ////////////////////////////
    if (game==16){
        result=userPoints*multiplier;

  }
  ////////////////////////////
  ////////////////////////////
    if (game==17){
        result=userPoints*2*multiplier;

  }
  ////////////////////////////
  ////////////////////////////
    if (game==18){
    if (userPoints!=0){
        result = 18;
    }
  }
  ////////////////////////////
  ////////////////////////////
    if (game==19){
        result=userPoints*multiplier;

  }
  ////////////////////////////
  ////////////////////////////
    if (game==20){
    if (field=1){
        if(userPoints<20){
      result=1;
    }
    if(userPoints<17){
      result=2;
    }
    if(userPoints<15){
      result=3;
    }
    if(userPoints<13){
      result=4;
    }
    if(userPoints<12){
      result=5;
    }
    if(userPoints<11){
      result=6;
    }
    if(userPoints<10){
      result=7;
    }
    if(userPoints<9){
      result=8;
    }
    if(userPoints<8){
      result=9;
    }
    if(userPoints<7){
      result=10;
    }
    }
  }
  ////////////////////////////
  ////////////////////////////[2345, 4535, 3265, 4542]
    if (game==21){
     if(field==1 && userPoints==2345){
      result=10;
    }
    if(field==2 && userPoints==4535){
      result=10;
    }
    if(field==3 && userPoints==3265){
      result=10;
    }
    if(field==4 && userPoints==4542){
      result=10;
    }
  }
  ////////////////////////////
  ////////////////////////////
    if (game==22){
      result=userPoints*2*multiplier;

  }
  ////////////////////////////
  ////////////////////////////
    if (game==23){
            result=userPoints*3*multiplier;

  }
  ////////////////////////////
  ////////////////////////////[30, 35, 40, 45, 50, 55, 60, 65, 70, 75], [198, 7, 499]
    if (game==24){
    if (field==1){
         if(userPoints<75){
      result=1;
    }
    if(userPoints<70){
      result=2;
    }
    if(userPoints<65){
      result=3;
    }
    if(userPoints<60){
      result=4;
    }
    if(userPoints<55){
      result=5;
    }
    if(userPoints<50){
      result=6;
    }
    if(userPoints<45){
      result=7;
    }
    if(userPoints<40){
      result=8;
    }
    if(userPoints<35){
      result=9;
    }
    if(userPoints<30){
      result=10;
    }
    } 
    if(field==2 && userPoints==198){
      result=10;
    }
    if(field==3 && userPoints==7){
      result=10;
    }
    if(field==4 && userPoints==499){
      result=10;
    }
  }
  ////////////////////////////
  

  return result;
}
