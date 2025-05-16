// lib/calculatePoints.ts

export interface PointsInput {
  game: number;
  userPoints: number;
  multiplier: number;
}

export interface PointsResult {
  result: number;
}

/**
 * Beispiel: Summiert alle Punkte und gibt die Differenz zwischen User1 und User2 zurück.
 */
export function calculatePoints({ game, userPoints, multiplier }: PointsInput): number {
  let result = 0;

  if (game==1){
    if (userPoints!=0){
        result = 1*multiplier;
    }
  }
  if (game==2){
    if (userPoints!=0){
        result = 2;
    }
  }
  if (game==3){
    if (userPoints!=0){
        result = 3;
    }
  }
  if (game==4){
    if (userPoints!=0){
        result = 4;
    }
  }
  if (game==5){
    if (userPoints!=0){
        result = 5;
    }
  }
  if (game==6){
    if (userPoints!=0){
        result = 6;
    }
  }
  if (game==7){
    if (userPoints!=0){
        result = 7;
    }
  }

  if (game==8){
    if (userPoints!=0){
        result = 8;
    }
  }

    if (game==9){
    if (userPoints!=0){
        result = 9;
    }
  }
    if (game==10){
    if (userPoints!=0){
        result = 10;
    }
  }
    if (game==11){
    if (userPoints!=0){
        result = 11;
    }
  }
    if (game==12){
    if (userPoints!=0){
        result = 12;
    }
  }
    if (game==13){
    if (userPoints!=0){
        result = 13;
    }
  }
    if (game==14){
    if (userPoints!=0){
        result = 14;
    }
  }
    if (game==15){
    if (userPoints!=0){
        result = 15;
    }
  }
    if (game==16){
    if (userPoints!=0){
        result = 16;
    }
  }
    if (game==17){
    if (userPoints!=0){
        result = 17;
    }
  }
    if (game==18){
    if (userPoints!=0){
        result = 18;
    }
  }
    if (game==19){
    if (userPoints!=0){
        result = 19;
    }
  }
    if (game==20){
    if (userPoints!=0){
        result = 20;
    }
  }
    if (game==21){
    if (userPoints!=0){
        result = 21;
    }
  }
    if (game==22){
    if (userPoints!=0){
        result = 22;
    }
  }
    if (game==23){
    if (userPoints!=0){
        result = 23;
    }
  }
    if (game==24){
    if (userPoints!=0){
        result = 24;
    }
  }
  

  return result;
}
