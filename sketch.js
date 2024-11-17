let rivers = [];
let glyphSize = 80;  //dimensione base del glifo
let spacing = 250;    //distanza tra i glifi
let marginTop = 150;  //margine superiore 
let marginBottom = 50; //margine inferiore
let marginLeft = 50;   //margine sinistro
let marginRight = 50;  //margine destro

function preload() {
  // Carica il dataset dei fiumi
  rivers = loadTable('rivers.csv', 'csv', 'header');
  console.log(rivers.getRowCount(), "rows loaded");
}

function setup() {
  //imposta la canvas come responsiva
  createCanvas(windowWidth, windowHeight);
  noLoop();
  noStroke();  

  //calcola il numero di colonne e righe tenendo conto dei margini
  let cols = floor((width - marginLeft - marginRight) / spacing);  //sottrae i margini dalla larghezza
  let rows = ceil(rivers.getRowCount() / cols);  //calcola il numero di righe
  
  //ridimensiona il canvas per includere i margini
  resizeCanvas(cols * spacing + marginLeft + marginRight, rows * spacing + marginTop + marginBottom + 200);  // Aggiungi un po' di spazio extra per il testo

  background("white");
  
  //disegna il titolo
  drawTitle();

  //disegna la legenda
  drawLegend();
  
  //disegna il paragrafo
  drawParagraph();
  
  //disegna i glifi per ogni fiume
  for (let i = 0; i < rivers.getRowCount(); i++) {
    let x = marginLeft + (i % cols) * spacing;  //aggiungi il margine sinistro
    let y = marginTop + 300 + floor(i / cols) * spacing;  //aggiusta il margine per i glifi
    drawGlyph(x, y, rivers.getRow(i));
  }
}

function drawTitle() {
  //imposta il titolo sopra a tutto
  fill(0);  
  textSize(32);  
  textAlign(CENTER, CENTER);  //allinea il testo al centro
  text("Temperatura dei Fiumi nel Mondo", width / 2, marginTop / 3);  //posiziona il titolo
}

function drawLegend() {
  //imposta la legenda tra il titolo e il paragrafo
  fill(0);  
  textSize(16);  
  textAlign(LEFT, TOP);  //allinea il testo a sinistra
  
  let continentNames = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'];
  let continentColors = [
    color(212, 236, 243),  //Africa
    color(146, 188, 229),  //Asia
    color(3, 128, 196),    //Europa
    color(36, 64, 147),    //Nord America
    color(106, 85, 159),   //Sud America
    color(0, 119, 115),    //Australia
    color(155, 205, 159)   //Antartide
  ];
  
  let legendY = marginTop + 40;  //posizione per la legenda
  
  //disegna ogni colore associandogli il nome continente
  for (let i = 0; i < continentNames.length; i++) {
    fill(continentColors[i]);
    rect(marginLeft + 10, legendY + i * 30, 20, 20);  //rettangolo colorato
    
    fill(0);  
    text(continentNames[i], marginLeft + 40, legendY + i * 30 + 10);  //posiziona il nome del continente accanto al rettangolo
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
  //quando la finestra viene ridimensionata, ridisegna la canvas
  let cols = floor((width - marginLeft - marginRight) / spacing);  //considera i margini
  let rows = ceil(rivers.getRowCount() / cols);  //calcola le righe
  resizeCanvas(cols * spacing + marginLeft + marginRight, rows * spacing + marginTop + marginBottom + 200);  //ridimensiona la canvas
  background(240);
  
  //ridisegna il titolo
  drawTitle();
  
  //ridisegna la legenda
  drawLegend();
  
  //ridisegna il paragrafo
  drawParagraph();
  
  //ridisegna tutti i glifi
  for (let i = 0; i < rivers.getRowCount(); i++) {
    let x = marginLeft + (i % cols) * spacing;
    let y = marginTop + 120 + floor(i / cols) * spacing;
    drawGlyph(x, y, rivers.getRow(i));
  }
}