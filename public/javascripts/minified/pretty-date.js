/*
   For readable source code, check the 'hubs: 
   http://github.com/lachlanhardy/lachstock/blob/master/public/javascripts/pretty-date.js 
*/

function prettyDate(d){var b=new Date((d||"").replace(/-/g,"/").replace(/[TZ]/g," ")),c=(((new Date()).getTime()-b.getTime())/1000),a=Math.floor(c/86400);if(isNaN(a)||a<0||a>=31){return}return a==0&&(c<60&&"just now"||c<120&&"1 minute ago"||c<3600&&Math.floor(c/60)+" minutes ago"||c<7200&&"1 hour ago"||c<86400&&Math.floor(c/3600)+" hours ago")||a==1&&"Yesterday"||a<7&&a+" days ago"||a<31&&Math.ceil(a/7)+" weeks ago"}if(typeof jQuery!="undefined"){jQuery.fn.prettyDate=function(){return this.each(function(){var a=prettyDate(this.title);if(a){jQuery(this).text(a)}})}};