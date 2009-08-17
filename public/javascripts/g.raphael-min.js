/*
 * g.Raphael 0.2 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
 
(function(){Raphael.fn.g=Raphael.fn.g||{};Raphael.fn.g.markers={disc:"disc",o:"disc",square:"square",s:"square",triangle:"triangle",t:"triangle",star:"star","*":"star",cross:"cross",x:"cross",plus:"plus","+":"plus",arrow:"arrow","->":"arrow"};Raphael.fn.g.txtattr={font:"12px Arial, sans-serif"};Raphael.fn.g.colors=[];var B=[0.6,0.2,0.05,0.1333,0.75,0];for(var A=0;A<10;A++){if(A<B.length){Raphael.fn.g.colors.push("hsb("+B[A]+", .75, .75)");}else{Raphael.fn.g.colors.push("hsb("+B[A-B.length]+", 1, .5)");}}Raphael.fn.g.text=function(C,E,D){return this.text(C,E,D).attr(this.g.txtattr);};Raphael.fn.g.labelise=function(C,E,D){if(C){return(C+"").replace(/(##+(?:\.#+)?)|(%%+(?:\.%+)?)/g,function(F,H,G){if(H){return(+E).toFixed(H.replace(/^#+\.?/g,"").length);}if(G){return(E*100/D).toFixed(G.replace(/^%+\.?/g,"").length)+"%";}});}else{return(+E).toFixed(0);}};Raphael.fn.g.finger=function(I,H,D,J,E,F,G){if((E&&!J)||(!E&&!D)){return G?"":this.path({});}F={square:"square",sharp:"sharp",soft:"soft"}[F]||"round";var L;J=Math.round(J);D=Math.round(D);I=Math.round(I);H=Math.round(H);switch(F){case"round":if(!E){var C=Math.floor(J/2);if(D<C){C=D;L=["M",I+0.5,H+0.5-Math.floor(J/2),"l",0,0,"a",C,Math.floor(J/2),0,0,1,0,J,"l",0,0,"z"];}else{L=["M",I+0.5,H+0.5-C,"l",D-C,0,"a",C,C,0,1,1,0,J,"l",C-D,0,"z"];}}else{var C=Math.floor(D/2);if(J<C){C=J;L=["M",I-Math.floor(D/2),H,"l",0,0,"a",Math.floor(D/2),C,0,0,1,D,0,"l",0,0,"z"];}else{L=["M",I-C,H,"l",0,C-J,"a",C,C,0,1,1,D,0,"l",0,J-C,"z"];}}break;case"sharp":if(!E){var K=Math.floor(J/2);L=["M",I+0.5,H+0.5+K,"l",0,-J,Math.max(D-K,0),0,Math.min(K,D),K,-Math.min(K,D),K+(K*2<J),"z"];}else{var K=Math.floor(D/2);L=["M",I+K,H,"l",-D,0,0,-Math.max(J-K,0),K,-Math.min(K,J),K+(K*2<J),Math.min(K,J),K,"z"];}break;case"square":if(!E){L=["M",I+0.5,H+0.5+Math.floor(J/2),"l",0,-J,D,0,0,J,"z"];}else{L=["M",I+Math.floor(D/2),H,"l",-D,0,0,-J,D,0,"z"];}break;case"soft":var C;if(!E){C=Math.min(D,Math.round(J/5));L=["M",I+0.5,H+0.5-Math.floor(J/2),"l",D-C,0,"a",C,C,0,0,1,C,C,"l",0,J-C*2,"a",C,C,0,0,1,-C,C,"l",C-D,0,"z"];}else{C=Math.min(Math.round(D/5),J);L=["M",I-Math.floor(D/2),H,"l",0,C-J,"a",C,C,0,0,1,C,-C,"l",D-2*C,0,"a",C,C,0,0,1,C,C,"l",0,J-C,"z"];}}if(G){return L.join(",");}else{return this.path({},L);}};Raphael.fn.g.disc=function(C,E,D){return this.circle(C,E,D);};Raphael.fn.g.line=function(C,E,D){return this.rect(C-D,E-D/5,2*D,2*D/5);};Raphael.fn.g.square=function(C,E,D){D=D*0.7;return this.rect(C-D,E-D,2*D,2*D);};Raphael.fn.g.triangle=function(C,E,D){D*=1.75;return this.path({},"M".concat(C,",",E,"m0-",D*0.58,"l",D*0.5,",",D*0.87,"-",D,",0z"));};Raphael.fn.g.star=function(C,I,H,D){D=D||H*0.5;var G=["M",C,I+D,"L"],F;for(var E=1;E<10;E++){F=E%2?H:D;G=G.concat([(C+F*Math.sin(E*Math.PI*0.2)).toFixed(3),(I+F*Math.cos(E*Math.PI*0.2)).toFixed(3)]);}G.push("z");return this.path({},G);};Raphael.fn.g.cross=function(C,E,D){D=D/2.5;return this.path({},"M".concat(C-D,",",E,"l",[-D,-D,D,-D,D,D,D,-D,D,D,-D,D,D,D,-D,D,-D,-D,-D,D,-D,-D,"z"]));};Raphael.fn.g.plus=function(C,E,D){D=D/2;return this.path({},"M".concat(C-D/2,",",E-D/2,"l",[0,-D,D,0,0,D,D,0,0,D,-D,0,0,D,-D,0,0,-D,-D,0,0,-D,"z"]));};Raphael.fn.g.arrow=function(C,E,D){return this.path({},"M".concat(C-D*0.7,",",E-D*0.4,"l",[D*0.6,0,0,-D*0.4,D,D*0.8,-D,D*0.8,0,-D*0.4,-D*0.6,0],"z"));};Raphael.fn.g.tag=function(C,J,I,H,F){H=H||0;F=F==null?5:F;I=I==null?"$9.99":I;var E=0.5522*F,D=this.set(),G=3;D.push(this.path({fill:"#000",stroke:"none"}));D.push(this.text(C,J,I).attr(this.g.txtattr).attr({fill:"#fff"}));D.update=function(){this.rotate(0,C,J);var L=this[1].getBBox();if(L.height>=F*2){this[0].attr({path:["M",C,J+F,"a",F,F,0,1,1,0,-F*2,F,F,0,1,1,0,F*2,"m",0,-F*2-G,"a",F+G,F+G,0,1,0,0,(F+G)*2,"L",C+F+G,J+L.height/2+G,"l",L.width+2*G,0,0,-L.height-2*G,-L.width-2*G,0,"L",C,J-F-G].join(",")});}else{var K=Math.sqrt(Math.pow(F+G,2)-Math.pow(L.height/2+G,2));this[0].attr({path:["M",C,J+F,"c",-E,0,-F,E-F,-F,-F,0,-E,F-E,-F,F,-F,E,0,F,F-E,F,F,0,E,E-F,F,-F,F,"M",C+K,J-L.height/2-G,"a",F+G,F+G,0,1,0,0,L.height+2*G,"l",F+G-K+L.width+2*G,0,0,-L.height-2*G,"L",C+K,J-L.height/2-G].join(",")});}this[1].attr({x:C+F+G+L.width/2,y:J});H=(360-H)%360;this.rotate(H,C,J);H>90&&H<270&&this[1].attr({x:C-F-G-L.width/2,y:J,rotation:[180+H,C,J]});return this;};D.update();return D;};Raphael.fn.g.popupit=function(H,G,I,D,N){D=D==null?2:D;N=N||5;H=Math.round(H)+0.5;G=Math.round(G)+0.5;var F=I.getBBox(),J=Math.round(F.width/2),E=Math.round(F.height/2),M=[0,J+N*2,0,-J-N*2],K=[-E*2-N*3,-E-N,0,-E-N],C=["M",H-M[D],G-K[D],"l",-N,(D==2)*-N,-Math.max(J-N,0),0,"a",N,N,0,0,1,-N,-N,"l",0,-Math.max(E-N,0),(D==3)*-N,-N,(D==3)*N,-N,0,-Math.max(E-N,0),"a",N,N,0,0,1,N,-N,"l",Math.max(J-N,0),0,N,!D*-N,N,!D*N,Math.max(J-N,0),0,"a",N,N,0,0,1,N,N,"l",0,Math.max(E-N,0),(D==1)*N,N,(D==1)*-N,N,0,Math.max(E-N,0),"a",N,N,0,0,1,-N,N,"l",-Math.max(J-N,0),0,"z"].join(","),L=[{x:H,y:G+N*2+E},{x:H-N*2-J,y:G},{x:H,y:G-N*2-E},{x:H+N*2+J,y:G}][D];I.translate(L.x-J-F.x,L.y-E-F.y);return this.path({fill:"#000",stroke:"none"},C).insertBefore(I.node?I:I[0]);};Raphael.fn.g.popup=function(C,I,H,D,F){D=D==null?2:D;F=F||5;H=H||"$9.99";var E=this.set(),G=3;E.push(this.path({fill:"#000",stroke:"none"}));E.push(this.text(C,I,H).attr(this.g.txtattr).attr({fill:"#fff"}));E.update=function(L,K,M){L=L||C;K=K||I;var O=this[1].getBBox(),P=O.width/2,N=O.height/2,S=[0,P+F*2,0,-P-F*2],Q=[-N*2-F*3,-N-F,0,-N-F],J=["M",L-S[D],K-Q[D],"l",-F,(D==2)*-F,-Math.max(P-F,0),0,"a",F,F,0,0,1,-F,-F,"l",0,-Math.max(N-F,0),(D==3)*-F,-F,(D==3)*F,-F,0,-Math.max(N-F,0),"a",F,F,0,0,1,F,-F,"l",Math.max(P-F,0),0,F,!D*-F,F,!D*F,Math.max(P-F,0),0,"a",F,F,0,0,1,F,F,"l",0,Math.max(N-F,0),(D==1)*F,F,(D==1)*-F,F,0,Math.max(N-F,0),"a",F,F,0,0,1,-F,F,"l",-Math.max(P-F,0),0,"z"].join(","),R=[{x:L,y:K+F*2+N},{x:L-F*2-P,y:K},{x:L,y:K-F*2-N},{x:L+F*2+P,y:K}][D];if(M){this[0].animate({path:J},500,">");this[1].animate(R,500,">");}else{this[0].attr({path:J});this[1].attr(R);}return this;};return E.update(C,I);};Raphael.fn.g.flag=function(C,H,G,F){F=F||0;G=G||"$9.99";var D=this.set(),E=3;D.push(this.path({fill:"#000",stroke:"none"}));D.push(this.text(C,H,G).attr(this.g.txtattr).attr({fill:"#fff"}));D.update=function(I,L){this.rotate(0,I,L);var K=this[1].getBBox(),J=K.height/2;this[0].attr({path:["M",I,L,"l",J+E,-J-E,K.width+2*E,0,0,K.height+2*E,-K.width-2*E,0,"z"].join(",")});this[1].attr({x:I+J+E+K.width/2,y:L});F=360-F;this.rotate(F,I,L);F>90&&F<270&&this[1].attr({x:I-r-E-K.width/2,y:L,rotation:[180+F,I,L]});return this;};return D.update(C,H);};Raphael.fn.g.label=function(C,F,E){var D=this.set();D.push(this.rect(C,F,10,10).attr({stroke:"none",fill:"#000"}));D.push(this.text(C,F,E).attr(this.g.txtattr).attr({fill:"#fff"}));D.update=function(){var H=this[1].getBBox(),G=Math.min(H.width+10,H.height+10)/2;this[0].attr({x:H.x-G/2,y:H.y-G/2,width:H.width+G,height:H.height+G,r:G});};D.update();return D;};Raphael.fn.g.labelit=function(E){var D=E.getBBox(),C=Math.min(20,D.width+10,D.height+10)/2;return this.rect(D.x-C/2,D.y-C/2,D.width+C,D.height+C,C).attr({stroke:"none",fill:"#000"}).insertBefore(E[0]);};Raphael.fn.g.drop=function(C,H,G,E,F){E=E||30;F=F||0;var D=this.set();D.push(this.path({},["M",C,H,"l",E,0,"A",E*0.4,E*0.4,0,1,0,C+E*0.7,H-E*0.7,"z"]).attr({fill:"#000",stroke:"none",rotation:[22.5-F,C,H]}));F=(F+90)*Math.PI/180;D.push(this.text(C+E*Math.sin(F),H+E*Math.cos(F),G).attr(this.g.txtattr).attr({"font-size":E*12/30,fill:"#fff"}));D.drop=D[0];D.text=D[1];return D;};Raphael.fn.g.blob=function(D,J,I,H){var H=(+H+1?H:45)+90,F=12,C=Math.PI/180,G=F*12/12;var E=this.set();E.push(this.path({fill:"#000",stroke:"none"}));E.push(this.text(D+F*Math.sin((H)*C),J+F*Math.cos((H)*C)-G/2,I).attr(this.g.txtattr).attr({"font-size":G,fill:"#fff"}));E.update=function(P,O,T){P=P||D;O=O||J;var V=this[1].getBBox(),a=Math.max(V.width+G,F*25/12),U=Math.max(V.height+G,F*25/12),L=P+F*Math.sin((H-22.5)*C),W=O+F*Math.cos((H-22.5)*C),N=P+F*Math.sin((H+22.5)*C),Z=O+F*Math.cos((H+22.5)*C),c=(N-L)/2,b=(Z-W)/2,M=a/2,K=U/2,S=-Math.sqrt(Math.abs(M*M*K*K-M*M*b*b-K*K*c*c)/(M*M*b*b+K*K*c*c)),R=S*M*b/K+(N+L)/2,Q=S*-K*c/M+(Z+W)/2;if(T){this.animate({x:R,y:Q,path:["M",D,J,"L",N,Z,"A",M,K,0,1,1,L,W,"z"].join(",")},500,">");}else{this.attr({x:R,y:Q,path:["M",D,J,"L",N,Z,"A",M,K,0,1,1,L,W,"z"].join(",")});}return this;};E.update(D,J);return E;};Raphael.fn.g.colorValue=function(F,E,D,C){return"hsb("+[Math.min((1-F/E)*0.4,1),D||0.75,C||0.75]+")";};Raphael.fn.g.snapEnds=function(I,J,H){var F=I,K=J;if(F==K){return{from:F,to:K,power:0};}function L(M){return Math.abs(M-0.5)<0.25?Math.floor(M)+0.5:Math.round(M);}var G=(K-F)/H,C=Math.floor(G),E=C,D=0;if(C){while(E){D--;E=Math.floor(G*Math.pow(10,D))/Math.pow(10,D);}D++;}else{while(!C){D=D||1;C=Math.floor(G*Math.pow(10,D))/Math.pow(10,D);D++;}D&&D--;}var K=L(J*Math.pow(10,D))/Math.pow(10,D);if(K<J){K=L((J+0.5)*Math.pow(10,D))/Math.pow(10,D);}var F=L((I-(D>0?0:0.5))*Math.pow(10,D))/Math.pow(10,D);return{from:F,to:K,power:D};};Raphael.fn.g.axis=function(N,M,I,W,F,b,G,e,H,C){C=C==null?2:C;H=H||"t";b=b||10;var V=H=="|"||H==" "?["M",N+0.5,M,"l",0,0.001]:G==1||G==3?["M",N+0.5,M,"l",0,-I]:["M",N,M+0.5,"l",I,0],P=this.g.snapEnds(W,F,b),c=P.from,R=P.to,a=P.power,Z=0,S=this.set();d=(R-c)/b;var L=c,K=a>0?a:0;O=I/b;if(+G==1||+G==3){var D=M,Q=(G-1?1:-1)*(C+3+!!(G-1));while(D>=M-I){H!="-"&&H!=" "&&(V=V.concat(["M",N-(H=="+"||H=="|"?C:!(G-1)*C*2),D+0.5,"l",C*2+1,0]));S.push(this.text(N+Q,D,(e&&e[Z++])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr).attr({"text-anchor":G-1?"start":"end"}));L+=d;D-=O;}if(Math.round(D+O-(M-I))){H!="-"&&H!=" "&&(V=V.concat(["M",N-(H=="+"||H=="|"?C:!(G-1)*C*2),M-I+0.5,"l",C*2+1,0]));S.push(this.text(N+Q,M-I,(e&&e[Z])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr).attr({"text-anchor":G-1?"start":"end"}));}}else{var E=N,L=c,K=a>0?a:0,Q=(G?-1:1)*(C+9+!G),O=I/b,T=0,U=0;while(E<=N+I){H!="-"&&H!=" "&&(V=V.concat(["M",E+0.5,M-(H=="+"?C:!!G*C*2),"l",0,C*2+1]));S.push(T=this.text(E,M+Q,(e&&e[Z++])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr));var J=T.getBBox();if(U>=J.x-5){S.pop(S.length-1).remove();}else{U=J.x+J.width;}L+=d;E+=O;}if(Math.round(E-O-N-I)){H!="-"&&H!=" "&&(V=V.concat(["M",N+I+0.5,M-(H=="+"?C:!!G*C*2),"l",0,C*2+1]));S.push(this.text(N+I,M+Q,(e&&e[Z])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr));}}var g=this.path({},V);g.text=S;g.all=this.set([g,S]);g.remove=function(){this.text.remove();this.constructor.prototype.remove.call(this);};return g;};Raphael.el.lighter=function(D){D=D||2;var C=[this.attrs.fill,this.attrs.stroke];this.fs=this.fs||[C[0],C[1]];C[0]=Raphael.rgb2hsb(Raphael.getRGB(C[0]).hex);C[1]=Raphael.rgb2hsb(Raphael.getRGB(C[1]).hex);C[0].b=Math.min(C[0].b*D,1);C[0].s=C[0].s/D;C[1].b=Math.min(C[1].b*D,1);C[1].s=C[1].s/D;this.attr({fill:"hsb("+[C[0].h,C[0].s,C[0].b]+")",stroke:"hsb("+[C[1].h,C[1].s,C[1].b]+")"});};Raphael.el.darker=function(D){D=D||2;var C=[this.attrs.fill,this.attrs.stroke];this.fs=this.fs||[C[0],C[1]];C[0]=Raphael.rgb2hsb(Raphael.getRGB(C[0]).hex);C[1]=Raphael.rgb2hsb(Raphael.getRGB(C[1]).hex);C[0].s=Math.min(C[0].s*D,1);C[0].b=C[0].b/D;C[1].s=Math.min(C[1].s*D,1);C[1].b=C[1].b/D;this.attr({fill:"hsb("+[C[0].h,C[0].s,C[0].b]+")",stroke:"hsb("+[C[1].h,C[1].s,C[1].b]+")"});};Raphael.el.original=function(){if(this.fs){this.attr({fill:this.fs[0],stroke:this.fs[1]});delete this.fs;}};})();