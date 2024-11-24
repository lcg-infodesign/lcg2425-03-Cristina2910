let rivers = [];
let glyphSize = 80;  //dimensione base del glifo
let spacing = 250;    //distanza tra i glifi
let marginTop = 150;  //margine superiore 
let marginBottom = 50; //margine inferiore
let margin = 50;  // Imposta un valore comune per i margini sinistro e destro

// Usa questa variabile per entrambi i margini
let marginLeft = margin;  
let marginRight = margin; 


function preload() {
  // Carica il dataset dei fiumi
  rivers = loadTable('rivers.csv', 'csv', 'header');
  console.log(rivers.getRowCount(), "rows loaded");
}

function setup() {
  // Imposta il margine sinistro e destro uguali
  let margin = 50;
  let marginLeft = margin;
  let marginRight = margin;

  // Imposta la canvas come responsiva
  createCanvas(windowWidth, windowHeight);
  noLoop();
  noStroke();  

  // Calcola il numero di colonne e righe tenendo conto dei margini
  let cols = floor((width - marginLeft - marginRight) / spacing);  // Sottrae i margini dalla larghezza
  let rows = ceil(rivers.getRowCount() / cols);  // Calcola il numero di righe
  
  // Ridimensiona la canvas per includere i margini
  resizeCanvas(cols * spacing + marginLeft + marginRight, rows * spacing + marginTop + marginBottom + 200);  // Aggiungi un po' di spazio extra per il testo

  background("white");
  
  // Disegna il titolo
  drawTitle();
  
  // Disegna la legenda
  drawLegend();
  
  // Disegna il paragrafo
  drawParagraph();
  
  // Disegna i glifi per ogni fiume
  for (let i = 0; i < rivers.getRowCount(); i++) {
    let x = marginLeft + (i % cols) * spacing;  // Aggiungi il margine sinistro
    let y = marginTop + 300 + floor(i / cols) * spacing;  // Aggiusta il margine per i glifi
    drawGlyph(x, y, rivers.getRow(i));
  }
}


function drawTitle() {
  // Imposta il titolo allineato a sinistra
  fill(0);  
  textSize(32);  
  textAlign(LEFT, CENTER);  // Allinea il testo a sinistra
  text("Temperatura dei Fiumi nel Mondo", marginLeft, marginTop / 3);  // Posiziona il titolo a sinistra
}

function drawLegend() {
  fill(0);  
  textSize(16);  
  textAlign(LEFT, TOP);  // Allinea il testo a sinistra e in alto
  
  let continentNames = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'];
  let continentColors = [
    color(212, 236, 243),  // Africa
    color(146, 188, 229),  // Asia
    color(3, 128, 196),    // Europa
    color(36, 64, 147),    // Nord America
    color(106, 85, 159),   // Sud America
    color(0, 119, 115),    // Australia
    color(155, 205, 159)   // Antartide
  ];
  
  let legendY = marginTop + 40;  // Posizione verticale della legenda, subito sotto il titolo
  
  // Disegna ogni colore associandogli il nome continente
  for (let i = 0; i < continentNames.length; i++) {
    fill(continentColors[i]);
    rect(marginLeft, legendY + i * 30, 20, 20);  // Rettangolo colorato
    
    fill(0);  
    text(continentNames[i], marginLeft + 30, legendY + i * 30 + 10);  // Posiziona il nome del continente accanto al rettangolo
  }
}



function drawParagraph() {
  //imposta il paragrafo accanto alla legenda
  fill(0);  
  textSize(16); 
  textAlign(LEFT, TOP);  //allinea il testo in alto e a sinistra
  
  //posiziona il paragrafo a destra della legenda
  textWrap(WORD);
  text(
    "La visualizzazione mostra i dati su 100 fiumi presenti nel territorio mondiale. " +
    "Ogni fiume è rappresentato da un cerchio sui toni dell'azzurro la cui dimensione dipende " +
    "da quanto è più grande o più piccola l'area che occupa. La gradazione dell'azzurro dipende dal continente " +
    "di appartenenza. Sopra ogni cerchio sono rappresentati altri due cerchi più piccoli, quello rosa rappresenta " +
    "la temperatura minima del fiume in questione, mentre quello rosso la temperatura massima. Questi due cerchi, " +
    "ovviamente, sono calcolati proporzionalmente alla temperatura del fiume cui fanno riferimento.",
    marginLeft + 250, marginTop + 40, width - marginLeft - marginRight - 250 
  );
}

function drawGlyph(x, y, data) {
  let name = data.getString('name');
  let area = data.getNum('area');
  let continent = data.getString('continent');
  let minTemp = data.getNum('min_temp');
  let maxTemp = data.getNum('max_temp');
  
  //dimensione dei cerchi in base all'area
  let areaNorm = map(area, 78500, 7050000, 40, 100);
  
  //calcola il colore in base al continente
  let continentColor;
  switch (continent.toLowerCase()) {
    case 'africa':
      continentColor = color(212, 236, 243);  //Africa
      break;
    case 'asia':
      continentColor = color(146, 188, 229);  //Asia
      break;
    case 'europe':
      continentColor = color(3, 128, 196);  //Europa
      break;
    case 'north america':
      continentColor = color(36, 64, 147);  //Nord America
      break;
    case 'south america':
      continentColor = color(106, 85, 159);  //Sud America
      break;
    case 'australia':
      continentColor = color(0, 119, 115);  //Australia
      break;
    case 'antarctica':
      continentColor = color(155, 205, 159);  //Antartide
      break;
    default:
      continentColor = color(150);  //colore di default per continenti sconosciuti
      break;
  }
  
  noStroke();
  
  //disegna il glifo
  push();
  translate(x + spacing / 2, y + spacing / 2);  //spazio tra i cerchi
  
  //cerchio grande per rappresentare l'area del bacino
  fill(continentColor);
  ellipse(0, 0, areaNorm);
  
  //calcola le dimensioni della temperatura minima e massima
  let minTempNorm = map(minTemp, -10, 40, 5, 30);
  let maxTempNorm = map(maxTemp, -10, 40, 5, 30);
  
  //cerchio per la temperatura minima
  fill("pink");  
  ellipse(0, -(areaNorm / 2 + 10), minTempNorm);  //posizionato sopra il cerchio grande
  
  //cerchio per la temperatura massima
  fill("red"); 
  ellipse(0, -(areaNorm / 2 + 10) - minTempNorm - 10, maxTempNorm);  //posizionato sopra il cerchio grande
  
  //aggiungi il nome del fiume sopra il glifo
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(name, 0, areaNorm / 2 + 20);
  
  pop();
}

function windowResized() {
  // Quando la finestra viene ridimensionata, ridisegna la canvas
  let margin = 50;  // Usando il valore comune per i margini
  let marginLeft = margin;
  let marginRight = margin;

  let cols = floor((width - marginLeft - marginRight) / spacing);  // Considera i margini
  let rows = ceil(rivers.getRowCount() / cols);  // Calcola le righe
  resizeCanvas(cols * spacing + marginLeft + marginRight, rows * spacing + marginTop + marginBottom + 200);  // Ridimensiona la canvas
  background(240);
  
  // Ridisegna il titolo
  drawTitle();
  
  // Ridisegna la legenda
  drawLegend();
  
  // Ridisegna il paragrafo
  drawParagraph();
  
  // Ridisegna tutti i glifi
  for (let i = 0; i < rivers.getRowCount(); i++) {
    let x = marginLeft + (i % cols) * spacing;
    let y = marginTop + 120 + floor(i / cols) * spacing;
    drawGlyph(x, y, rivers.getRow(i));
  }
}
