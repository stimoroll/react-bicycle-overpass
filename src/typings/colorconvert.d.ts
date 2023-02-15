import { hsl2rgb, rgb2hsl } from '@youc/colorconvert';
// import { hex2rgb } from './colorconvert.d';
// import { hsl2rgb } from '@charlesstover/hsl2rgb';

declare module '@youc/colorconvert' {
  export function hsl2rgb(h:number, s:number, l:number):[number, number, number]  {
    return hsl2rgb(h,s,l);
  }

  export function rgb2hsl(r:number, g:number, b:number):[number, number, number]  {
    return rgb2hsl(r,g,b);
  }
  // function hsl2rgb(h: number, s: number, l: number) {
  //   throw new Error("Function not implemented.");
  // }  
  // export function hex2rgb():any;
  // export function hsl2rgb():any;
  // export function rgb2hsl():any;
}

/* 	exports.hex2rgb = hex2rgb;
	exports.hsl2rgb = hsl2rgb;
	exports.hsv2rgb = hsv2rgb;
	exports.rgb2hex = rgb2hex;
	exports.rgb2hsl = rgb2hsl;
	exports.rgb2hsv = rgb2hsv;
  */