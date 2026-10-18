/**
 * Tablero de misiones: imagen base (camino entero en blanco, sin números) + geometría de las 25 casillas.
 *
 * La imagen vive en `public/` y se versiona junto a estos datos porque las formas dependen de ella al píxel.
 * Las formas se generaron a partir de la imagen base: relleno desde el centro de cada casilla
 * (zona blanca del camino o marrón de los tablones), cierre morfológico, contorno exterior y
 * simplificación Douglas–Peucker (~1,2 px). `color` es el color de la casilla en el mapa original
 * (bucket `documentos`). Si cambia la imagen base hay que regenerarlos; con `?mapDebug=1`
 * (solo en desarrollo) se ven los contornos sobre el mapa.
 */

export const MAP_BOARD_URL = '/map/tablero-base.webp';
export const MAP_BOARD_WIDTH = 800;
export const MAP_BOARD_HEIGHT = 1056;

export type MapTileKind = 'path' | 'plank';

export interface MapTile {
  mission: number;
  /** `path`: loseta del camino (se pinta con `color`); `plank`: tablón de madera de la ilustración */
  kind: MapTileKind;
  /** Centroide, en coordenadas de la imagen base: posición del número */
  cx: number;
  cy: number;
  /** Lado aproximado (raíz del área), para escalar el número */
  size: number;
  /** Color de la casilla en el mapa original */
  color: string;
  /** Contorno exacto (`d` de un <path> SVG, solo M/L/Z) */
  d: string;
}

export const MAP_TILES: ReadonlyArray<MapTile> = [
  {
    mission: 1,
    kind: 'plank',
    cx: 215.5,
    cy: 198.8,
    size: 92.2,
    color: '#e39c5a',
    d: 'M254.5 144.5L259.5 145.5L260.5 167.5L268.5 186.5L257.5 195.5L260.5 198.5L267.5 196.5L269.5 197.5L266.5 202.5L269.5 205.5L272.5 205.5L276.5 216.5L266.5 223.5L254.5 228.5L226.5 235.5L208.5 243.5L186.5 263.5L183.5 261.5L182.5 257.5L177.5 247.5L169.5 221.5L172.5 214.5L167.5 210.5L167.5 206.5L174.5 199.5L171.5 196.5L166.5 198.5L164.5 196.5L159.5 172.5L170.5 164.5L182.5 159.5L221.5 158.5Z',
  },
  {
    mission: 2,
    kind: 'path',
    cx: 287.1,
    cy: 259.6,
    size: 78,
    color: '#ec1c25',
    d: 'M278.5 217.5L297.5 222.5L327.5 225.5L329.5 227.5L328.5 295.5L326.5 297.5L306.5 296.5L287.5 294.5L259.5 288.5L242.5 282.5L225.5 272.5L262.5 228.5Z',
  },
  {
    mission: 3,
    kind: 'plank',
    cx: 384.3,
    cy: 255,
    size: 90.2,
    color: '#e39c5a',
    d: 'M376.5 207.5L382.5 211.5L386.5 207.5L417.5 207.5L431.5 210.5L423.5 232.5L423.5 248.5L430.5 285.5L429.5 301.5L427.5 303.5L415.5 302.5L410.5 298.5L407.5 301.5L403.5 301.5L402.5 294.5L398.5 290.5L395.5 293.5L395.5 298.5L393.5 304.5L379.5 301.5L368.5 301.5L345.5 307.5L342.5 306.5L346.5 264.5L336.5 234.5L338.5 216.5L342.5 209.5L347.5 208.5L366.5 208.5L370.5 215.5Z',
  },
  {
    mission: 4,
    kind: 'path',
    cx: 474.2,
    cy: 249.8,
    size: 72.8,
    color: '#b5e520',
    d: 'M452.5 215.5L488.5 216.5L516.5 220.5L518.5 222.5L503.5 286.5L501.5 288.5L494.5 287.5L475.5 284.5L450.5 284.5L440.5 286.5L438.5 284.5L435.5 218.5L437.5 216.5Z',
  },
  {
    mission: 5,
    kind: 'path',
    cx: 548.2,
    cy: 267.8,
    size: 72.8,
    color: '#ef9d34',
    d: 'M522.5 222.5L551.5 231.5L572.5 241.5L600.5 262.5L562.5 307.5L553.5 316.5L536.5 302.5L505.5 288.5L519.5 227.5Z',
  },
  {
    mission: 6,
    kind: 'path',
    cx: 602.4,
    cy: 314.5,
    size: 68.5,
    color: '#fb0380',
    d: 'M603.5 264.5L620.5 282.5L632.5 300.5L643.5 324.5L647.5 338.5L640.5 341.5L606.5 346.5L601.5 348.5L593.5 346.5L574.5 347.5L571.5 344.5L563.5 326.5L556.5 318.5L557.5 315.5Z',
  },
  {
    mission: 7,
    kind: 'plank',
    cx: 609.9,
    cy: 388.5,
    size: 81.5,
    color: '#e19c5b',
    d: 'M578.5 347.5L604.5 349.5L639.5 361.5L662.5 362.5L657.5 375.5L656.5 394.5L654.5 397.5L655.5 408.5L653.5 416.5L653.5 433.5L643.5 433.5L629.5 429.5L612.5 419.5L601.5 416.5L577.5 418.5L556.5 417.5L562.5 402.5L565.5 352.5Z',
  },
  {
    mission: 8,
    kind: 'path',
    cx: 555.5,
    cy: 444.6,
    size: 71.2,
    color: '#02a2e6',
    d: 'M554.5 402.5L559.5 405.5L555.5 411.5L556.5 413.5L553.5 417.5L554.5 420.5L558.5 421.5L560.5 419.5L586.5 418.5L593.5 426.5L597.5 426.5L614.5 441.5L600.5 454.5L597.5 453.5L594.5 455.5L592.5 457.5L593.5 458.5L587.5 463.5L558.5 476.5L530.5 486.5L525.5 484.5L526.5 481.5L523.5 476.5L521.5 463.5L510.5 424.5L512.5 420.5L514.5 421.5L517.5 418.5L537.5 411.5L541.5 412.5L544.5 408.5Z',
  },
  {
    mission: 9,
    kind: 'path',
    cx: 475.1,
    cy: 462.8,
    size: 76.4,
    color: '#ef9d33',
    d: 'M505.5 421.5L508.5 423.5L524.5 486.5L522.5 488.5L488.5 495.5L444.5 499.5L436.5 499.5L434.5 497.5L432.5 433.5L434.5 431.5L469.5 429.5Z',
  },
  {
    mission: 10,
    kind: 'path',
    cx: 390.8,
    cy: 463.1,
    size: 75.2,
    color: '#ea1d29',
    d: 'M355.5 423.5L390.5 429.5L428.5 431.5L430.5 433.5L431.5 497.5L426.5 499.5L372.5 495.5L350.5 491.5L347.5 488.5L352.5 428.5Z',
  },
  {
    mission: 11,
    kind: 'plank',
    cx: 300.8,
    cy: 447.3,
    size: 83.6,
    color: '#e39c5a',
    d: 'M268.5 400.5L279.5 400.5L283.5 407.5L288.5 401.5L316.5 406.5L343.5 405.5L345.5 407.5L342.5 421.5L334.5 442.5L334.5 453.5L341.5 469.5L344.5 483.5L344.5 491.5L343.5 494.5L341.5 494.5L330.5 493.5L326.5 489.5L323.5 492.5L306.5 491.5L303.5 488.5L299.5 491.5L285.5 489.5L262.5 490.5L265.5 476.5L265.5 466.5L259.5 446.5L257.5 426.5L260.5 411.5Z',
  },
  {
    mission: 12,
    kind: 'path',
    cx: 214.8,
    cy: 447.9,
    size: 72.4,
    color: '#fbaec9',
    d: 'M246.5 410.5L250.5 412.5L255.5 475.5L250.5 478.5L221.5 481.5L198.5 489.5L194.5 487.5L192.5 482.5L162.5 432.5L171.5 426.5L191.5 419.5L218.5 413.5Z',
  },
  {
    mission: 13,
    kind: 'path',
    cx: 147.5,
    cy: 480.9,
    size: 69.5,
    color: '#ef9d35',
    d: 'M159.5 432.5L193.5 490.5L175.5 501.5L165.5 511.5L157.5 523.5L140.5 515.5L110.5 503.5L98.5 496.5L115.5 467.5L138.5 445.5Z',
  },
  {
    mission: 14,
    kind: 'path',
    cx: 119.6,
    cy: 543.9,
    size: 66,
    color: '#b5de38',
    d: 'M98.5 499.5L143.5 518.5L157.5 526.5L154.5 537.5L154.5 548.5L158.5 561.5L155.5 564.5L131.5 574.5L99.5 587.5L95.5 583.5L89.5 556.5L89.5 530.5L93.5 509.5Z',
  },
  {
    mission: 15,
    kind: 'plank',
    cx: 163.7,
    cy: 618.2,
    size: 84.3,
    color: '#e29c5b',
    d: 'M202.5 568.5L206.5 568.5L208.5 570.5L208.5 580.5L205.5 584.5L209.5 590.5L210.5 601.5L208.5 605.5L212.5 610.5L212.5 618.5L217.5 637.5L199.5 640.5L169.5 656.5L149.5 663.5L131.5 664.5L124.5 662.5L120.5 660.5L118.5 652.5L118.5 648.5L121.5 644.5L117.5 640.5L116.5 605.5L112.5 588.5L159.5 587.5L168.5 583.5L179.5 575.5Z',
  },
  {
    mission: 16,
    kind: 'path',
    cx: 249,
    cy: 626.1,
    size: 73.2,
    color: '#5a6bb0',
    d: 'M215.5 588.5L241.5 591.5L281.5 589.5L283.5 591.5L290.5 655.5L286.5 658.5L272.5 659.5L226.5 659.5L208.5 657.5L201.5 654.5L202.5 643.5L205.5 640.5L220.5 638.5L214.5 622.5L213.5 609.5L210.5 605.5L212.5 602.5L211.5 598.5L213.5 590.5Z',
  },
  {
    mission: 17,
    kind: 'path',
    cx: 330.1,
    cy: 617.6,
    size: 75.7,
    color: '#ef9d34',
    d: 'M364.5 577.5L368.5 582.5L375.5 642.5L373.5 644.5L295.5 657.5L292.5 655.5L291.5 650.5L285.5 590.5L292.5 587.5L333.5 584.5Z',
  },
  {
    mission: 18,
    kind: 'path',
    cx: 414.1,
    cy: 601.3,
    size: 75.5,
    color: '#ea1e2a',
    d: 'M443.5 559.5L447.5 559.5L449.5 561.5L459.5 624.5L456.5 627.5L385.5 641.5L379.5 642.5L377.5 640.5L369.5 578.5L373.5 575.5Z',
  },
  {
    mission: 19,
    kind: 'plank',
    cx: 505.1,
    cy: 585.8,
    size: 84.4,
    color: '#e39c5a',
    d: 'M468.5 540.5L479.5 540.5L480.5 545.5L483.5 548.5L488.5 540.5L520.5 544.5L547.5 544.5L539.5 574.5L539.5 586.5L550.5 611.5L551.5 629.5L549.5 632.5L540.5 631.5L534.5 626.5L530.5 630.5L514.5 630.5L511.5 627.5L507.5 631.5L484.5 630.5L474.5 632.5L473.5 609.5L464.5 591.5L458.5 569.5L458.5 558.5L460.5 551.5L463.5 544.5Z',
  },
  {
    mission: 20,
    kind: 'path',
    cx: 597,
    cy: 597.5,
    size: 78.7,
    color: '#05fc46',
    d: 'M556.5 555.5L584.5 559.5L621.5 571.5L645.5 585.5L659.5 598.5L655.5 604.5L625.5 627.5L605.5 642.5L601.5 638.5L586.5 630.5L570.5 625.5L556.5 624.5L552.5 621.5L550.5 608.5L553.5 565.5L554.5 557.5Z',
  },
  {
    mission: 21,
    kind: 'path',
    cx: 649.5,
    cy: 664.8,
    size: 80.2,
    color: '#ef9d34',
    d: 'M662.5 602.5L672.5 614.5L679.5 629.5L684.5 652.5L684.5 670.5L680.5 690.5L670.5 709.5L653.5 727.5L647.5 722.5L604.5 678.5L604.5 676.5L610.5 671.5L614.5 661.5L613.5 652.5L608.5 645.5Z',
  },
  {
    mission: 22,
    kind: 'path',
    cx: 584,
    cy: 715.2,
    size: 77.3,
    color: '#eb1d27',
    d: 'M601.5 677.5L650.5 728.5L643.5 734.5L629.5 741.5L595.5 750.5L589.5 750.5L584.5 741.5L577.5 740.5L574.5 737.5L573.5 729.5L557.5 729.5L555.5 734.5L556.5 736.5L552.5 740.5L545.5 740.5L539.5 750.5L535.5 750.5L530.5 747.5L536.5 684.5L538.5 682.5L560.5 684.5L581.5 683.5Z',
  },
  {
    mission: 23,
    kind: 'path',
    cx: 486.6,
    cy: 707.2,
    size: 79.1,
    color: '#fdf108',
    d: 'M444.5 670.5L479.5 671.5L532.5 681.5L534.5 683.5L534.5 690.5L527.5 745.5L525.5 748.5L522.5 748.5L472.5 738.5L446.5 738.5L444.5 736.5L438.5 682.5L438.5 673.5Z',
  },
  {
    mission: 24,
    kind: 'path',
    cx: 393.3,
    cy: 716.1,
    size: 81.4,
    color: '#586ab2',
    d: 'M430.5 671.5L433.5 671.5L436.5 676.5L442.5 737.5L437.5 740.5L427.5 741.5L401.5 750.5L380.5 764.5L369.5 754.5L328.5 717.5L344.5 703.5L368.5 689.5L400.5 677.5Z',
  },
  {
    mission: 25,
    kind: 'plank',
    cx: 326,
    cy: 801.4,
    size: 86,
    color: '#e29c5b',
    d: 'M282.5 756.5L302.5 758.5L326.5 770.5L335.5 772.5L379.5 769.5L381.5 771.5L377.5 785.5L378.5 819.5L373.5 823.5L377.5 827.5L377.5 831.5L376.5 837.5L368.5 841.5L359.5 843.5L338.5 841.5L287.5 825.5L262.5 826.5L261.5 825.5L268.5 817.5L271.5 810.5L273.5 794.5L276.5 791.5L275.5 784.5L277.5 774.5L281.5 770.5L279.5 763.5Z',
  },
];

/** Caja envolvente de un contorno formado solo por M/L/Z. */
export function tileBoundingBox(d: string): { x: number; y: number; width: number; height: number } {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}
