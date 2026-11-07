(() => {
  'use strict';

  const DATA = window.ITCT_DATA.naveed;
  const COLORS = ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b'];
  const WIDTHS = [10,7,5,4,3,2];
  const state = {index:0, playing:false, timer:null, highlightedLayer:null};
  const $ = id => document.getElementById(id);
  const mainCanvas = $('mainCanvas');
  const ixCanvas = $('ixCanvas');
  const snrCanvas = $('snrCanvas');
  const slider = $('epochSlider');

  const RESULTS = {
    figure2:{kicker:'PAPER FIGURE 2',title:'Fitting followed by compression',image:'figure2.png',summary:'The layers first move upward as they acquire label information. After the drift-to-diffusion transition, the deeper layers move left under the 30-bin estimator while retaining most of their predictive information.',metrics:[['84','transition epoch'],['99%','epochs after transition'],['4 of 6','layers pass the compression threshold'],['0.943 bits','final output I(T;Y)']],boundary:'Layers 1 and 2 remain nearly lossless. The result supports compression for the deeper layers, not every layer.'},
    figure3:{kicker:'PAPER FIGURE 3',title:'Training data changes the final representation',image:'figure3.png',summary:'The 5%, 45%, and 85% runs follow the same broad path, but more training data raises the predictive information reached by the later layers.',metrics:[['0.277 bits','output I(T;Y), 5%'],['0.811 bits','output I(T;Y), 45%'],['0.943 bits','output I(T;Y), 85%'],['4,096','patterns used for evaluation']],boundary:'The comparison shows association with sample size. It does not establish that compression causes generalization.'},
    figure4:{kicker:'PAPER FIGURE 4',title:'Drift gives way to gradient fluctuations',image:'figure4.png',summary:'The geometric-mean gradient signal-to-noise ratio starts at 3.97 and falls below one at epoch 84. Weight norms increase, so the observed compression cannot be explained by shrinking weights.',metrics:[['3.97','initial gradient SNR'],['84','transition epoch'],['0.710 to 0.077','cross-entropy, transition to end'],['0.010','noise floor']],boundary:'The learning rate and batch size were not fully specified in the paper. The submitted run tunes them to produce a measurable drift regime.'},
    figure5:{kicker:'PAPER FIGURE 5',title:'Depth helps, then the gain saturates',image:'figure5.png',secondary:'depth_timing.png',summary:'Two or three hidden layers learn the target information substantially faster than one hidden layer. Adding more layers does not continue to reduce the required epochs.',metrics:[['1,548','epochs to 80%, 1 hidden'],['542','epochs to 80%, 3 hidden'],['2.9x','best speed-up'],['false','monotone with depth']],boundary:'The qualitative benefit of depth is reproduced, but the paper\'s ever-growing super-linear speed-up is not.'},
    figure6:{kicker:'PAPER FIGURE 6',title:'Converged layers and the IB bound',image:'figure6.png',summary:'The mean vertical gap to the Information Bottleneck curve is small and the inferred beta values decrease with depth. The output layer is close in both axes.',metrics:[['0.010 bits','mean vertical gap'],['0.044 bits','maximum vertical gap'],['0.20 bits','output excess I(X;T)'],['10.55 bits','layer 1 excess I(X;T)']],boundary:'A near-zero vertical gap is weak evidence for the wide layers because the IB curve is flat near I(X;Y). Their large horizontal excess remains important.'},
    figure7:{kicker:'PAPER FIGURE 7',title:'More training data moves the endpoint upward',image:'figure7.png',summary:'The final output representation contains progressively more label information as the training fraction increases from 3% to 85%.',metrics:[['0.234 bits','output I(T;Y), 3%'],['0.581 bits','output I(T;Y), 20%'],['0.876 bits','output I(T;Y), 60%'],['0.943 bits','output I(T;Y), 85%']],boundary:'Each condition uses 20 networks from one declared long-preset run. The remaining shortfall from 0.990 bits is principally a generalization gap.'},
    figure8:{kicker:'PAPER FIGURE 8',title:'A second rule shows the same broad phases',image:'figure8.png',summary:'A non-symmetric committee-machine rule and a 12-8-5-3-2 student network also show an early rise in label information followed by leftward motion.',metrics:[['5','committee perceptrons'],['12-8-5-3-2','student architecture'],['75','transition epoch'],['0.990 bits','I(X;Y)']],boundary:'This controlled task supports qualitative generality across two synthetic rules. It does not establish the behavior for large real-world networks.'},
    relu:{kicker:'ADDITIONAL EXPERIMENT',title:'ReLU also drops under max-scaled binning',image:'relu.png',summary:'With the submitted estimator, five of six ReLU layers and four of six tanh layers lose at least 0.5 bit from their peak.',metrics:[['4 of 6','tanh layers'],['5 of 6','ReLU layers'],['-3.17 bits','ReLU layer 3 drop'],['-2.38 bits','ReLU layer 5 drop']],boundary:'ReLU uses a bin range rescaled to each layer\'s current maximum. Growing outliers can lower the estimate without genuine representational compression, so the result remains inconclusive.'},
    bins:{kicker:'ADDITIONAL EXPERIMENT',title:'Wide-layer compression depends on bin count',image:'bins.png',summary:'The deeper layers lose information with 10, 30, and 100 bins, while the result for the wide layers changes strongly with estimator resolution.',metrics:[['5 of 6','compressing, 10 bins'],['4 of 6','compressing, 30 bins'],['3 of 6','compressing, 100 bins'],['12 bits','input-information ceiling']],boundary:'Absolute information values cannot be compared across bin counts. Only the within-estimator trajectory shape has a stable meaning.'}
  };

  function setupCanvas(canvas) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.round(rect.width));
    const height = Math.max(220, Math.round(rect.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,width,height);
    return {ctx,width,height};
  }

  function drawAxes(ctx, box, xTicks, yTicks, xMap, yMap, xLabel, yLabel, xFormat=v=>String(v), yFormat=v=>String(v)) {
    ctx.font = '11px Inter, sans-serif';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#dfe7e5';
    ctx.fillStyle = '#6a7d8c';
    xTicks.forEach(value => {
      const x = xMap(value);
      ctx.beginPath(); ctx.moveTo(x,box.t); ctx.lineTo(x,box.b); ctx.stroke();
      ctx.textAlign = 'center'; ctx.fillText(xFormat(value),x,box.b+19);
    });
    yTicks.forEach(value => {
      const y = yMap(value);
      ctx.beginPath(); ctx.moveTo(box.l,y); ctx.lineTo(box.r,y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(yFormat(value),box.l-8,y+4);
    });
    ctx.strokeStyle = '#8ca09f';
    ctx.beginPath(); ctx.moveTo(box.l,box.t); ctx.lineTo(box.l,box.b); ctx.lineTo(box.r,box.b); ctx.stroke();
    ctx.fillStyle = '#31485a'; ctx.font = '600 12px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(xLabel,(box.l+box.r)/2,box.b+42);
    ctx.save(); ctx.translate(15,(box.t+box.b)/2); ctx.rotate(-Math.PI/2); ctx.fillText(yLabel,0,0); ctx.restore();
  }

  function line(ctx, xs, ys, xMap, yMap, color, width=1.5, alpha=1, limit=null) {
    const count = Math.min(xs.length,ys.length,limit == null ? Infinity : limit);
    ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.globalAlpha=alpha; ctx.beginPath();
    let started=false;
    for(let i=0;i<count;i++){
      const xv=Number(xs[i]), yv=Number(ys[i]);
      if(!Number.isFinite(xv)||!Number.isFinite(yv)){started=false;continue}
      if(!started){ctx.moveTo(xMap(xv),yMap(yv));started=true}else{ctx.lineTo(xMap(xv),yMap(yv))}
    }
    ctx.stroke(); ctx.restore();
  }

  function drawDiamond(ctx,x,y,color,size=7){
    ctx.save(); ctx.translate(x,y); ctx.rotate(Math.PI/4); ctx.fillStyle=color; ctx.fillRect(-size,-size,size*2,size*2); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.strokeRect(-size,-size,size*2,size*2); ctx.restore();
  }

  function drawPlane(){
    const {ctx,width,height}=setupCanvas(mainCanvas);
    const box={l:58,r:width-20,t:18,b:height-54};
    const xMap=v=>box.l+(v/12.5)*(box.r-box.l);
    const yMap=v=>box.b-(v/1.02)*(box.b-box.t);
    drawAxes(ctx,box,[0,2,4,6,8,10,12],[0,.2,.4,.6,.8,1],xMap,yMap,'I(X;T) · bits','I(T;Y) · bits',v=>v,v=>v.toFixed(1));
    line(ctx,DATA.ib_curve.ix,DATA.ib_curve.iy,xMap,yMap,'#2c57d7',2.3,.85);
    DATA.mean_paths.forEach((path,layer)=>{
      const selected = state.highlightedLayer === null || state.highlightedLayer === layer;
      line(ctx,path.ix,path.iy,xMap,yMap,COLORS[layer],selected?1.4:1,.18);
      line(ctx,path.ix,path.iy,xMap,yMap,COLORS[layer],selected ? 2.8 : 1.2,selected ? .9 : .12,state.index+1);
    });
    const frame=DATA.frames[state.index];
    frame.networks.forEach((network,layer)=>{
      const selected = state.highlightedLayer === null || state.highlightedLayer === layer;
      ctx.fillStyle=COLORS[layer]; ctx.globalAlpha=selected ? .42 : .08;
      network.ix.forEach((x,index)=>{const y=network.iy[index];if(Number.isFinite(x)&&Number.isFinite(y)){ctx.beginPath();ctx.arc(xMap(x),yMap(y),3,0,Math.PI*2);ctx.fill()}});
      ctx.globalAlpha=1;
    });
    ctx.save(); ctx.setLineDash([5,5]); ctx.strokeStyle='#7a8b99'; ctx.lineWidth=1.4; ctx.beginPath();
    frame.means.forEach((point,index)=>index?ctx.lineTo(xMap(point.ix),yMap(point.iy)):ctx.moveTo(xMap(point.ix),yMap(point.iy))); ctx.stroke(); ctx.restore();
    frame.means.forEach((point,layer)=>{
      ctx.save();
      if(state.highlightedLayer !== null && state.highlightedLayer !== layer) ctx.globalAlpha=.18;
      drawDiamond(ctx,xMap(point.ix),yMap(point.iy),COLORS[layer],state.highlightedLayer===layer?9:7);
      ctx.restore();
    });
  }

  function drawIx(){
    const {ctx,width,height}=setupCanvas(ixCanvas); const box={l:50,r:width-16,t:16,b:height-42};
    const maxLog=Math.log10(DATA.epochs+1), xMap=v=>box.l+(Math.log10(Math.max(1,v))/maxLog)*(box.r-box.l), yMap=v=>box.b-(v/12.2)*(box.b-box.t);
    drawAxes(ctx,box,[1,10,100,1000,10000],[0,3,6,9,12],xMap,yMap,'epoch','I(X;T)',v=>v===10000?'10k':String(v),v=>String(v));
    DATA.ix_by_epoch.forEach((series,layer)=>line(ctx,series.epoch,series.value,xMap,yMap,COLORS[layer],1.8,.9));
    const x=xMap(DATA.frames[state.index].epoch+1);ctx.strokeStyle='#c85f4a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,box.t);ctx.lineTo(x,box.b);ctx.stroke();
  }

  function drawSnr(){
    const {ctx,width,height}=setupCanvas(snrCanvas); const box={l:50,r:width-16,t:16,b:height-42};
    const maxLog=Math.log10(DATA.epochs+1), lo=-1.5, hi=1.2;
    const xMap=v=>box.l+(Math.log10(Math.max(1,v))/maxLog)*(box.r-box.l), yMap=v=>box.b-(Math.log10(Math.max(.03,v))-lo)/(hi-lo)*(box.b-box.t);
    drawAxes(ctx,box,[1,10,100,1000,10000],[.1,1,10],xMap,yMap,'epoch','gradient SNR',v=>v===10000?'10k':String(v),v=>String(v));
    DATA.snr_by_epoch.forEach((series,layer)=>line(ctx,series.epoch,series.value,xMap,yMap,COLORS[layer],1.6,.9));
    ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle='#172f46';ctx.beginPath();ctx.moveTo(box.l,yMap(1));ctx.lineTo(box.r,yMap(1));ctx.stroke();ctx.restore();
    const tx=xMap(DATA.transition_epoch+1);ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle='#d99b26';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(tx,box.t);ctx.lineTo(tx,box.b);ctx.stroke();ctx.restore();
    const x=xMap(DATA.frames[state.index].epoch+1);ctx.strokeStyle='#c85f4a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,box.t);ctx.lineTo(x,box.b);ctx.stroke();
  }

  function updateText(){
    const frame=DATA.frames[state.index], epoch=frame.epoch, output=frame.means.at(-1), phase=epoch<DATA.transition_epoch?'drift':'diffusion';
    $('epochReadout').textContent=epoch.toLocaleString(); $('phaseReadout').textContent=phase;
    $('outputIx').textContent=output.ix.toFixed(3); $('outputIy').textContent=output.iy.toFixed(3);
    $('checkpointReadout').textContent=`${state.index+1} / ${DATA.frames.length}`;
    if(epoch===0){$('liveReading').textContent='At initialization, the six layers occupy different positions because their widths constrain how many activation codes they can form.'}
    else if(epoch<DATA.transition_epoch){$('liveReading').textContent=`At epoch ${epoch.toLocaleString()}, the mean stochastic gradient still dominates its fluctuations. Label information rises as the network fits the rule.`}
    else if(epoch<1000){$('liveReading').textContent=`At epoch ${epoch.toLocaleString()}, the run is past the SNR transition. The deeper layers continue acquiring label information while beginning their leftward motion.`}
    else{$('liveReading').textContent=`At epoch ${epoch.toLocaleString()}, the deeper layers have moved toward lower I(X;T) while remaining near the task's 0.990-bit label-information ceiling.`}
    const layerText=state.highlightedLayer===null?'all layers':`layer ${state.highlightedLayer+1}`;
    $('trajectoryStatus').textContent=`Epoch ${epoch}, ${phase} phase, checkpoint ${state.index+1} of ${DATA.frames.length}, showing ${layerText}.`;
  }

  function render(){drawPlane();drawIx();drawSnr();updateText()}
  function stop(){state.playing=false;clearInterval(state.timer);state.timer=null;$('playButton').textContent='▶';$('playButton').setAttribute('aria-pressed','false');$('playButton').setAttribute('aria-label','Play trajectory')}
  function play(){if(state.playing){stop();return}if(state.index>=DATA.frames.length-1){state.index=0;slider.value=0}state.playing=true;$('playButton').textContent='❚❚';$('playButton').setAttribute('aria-pressed','true');$('playButton').setAttribute('aria-label','Pause trajectory');state.timer=setInterval(()=>{if(state.index>=DATA.frames.length-1){stop();return}state.index++;slider.value=state.index;render()},Number($('speedSelect').value))}

  function refreshLegend(){document.querySelectorAll('[data-layer]').forEach(button=>{const layer=Number(button.dataset.layer),active=state.highlightedLayer===layer;button.classList.toggle('active',active);button.classList.toggle('dimmed',state.highlightedLayer!==null&&!active);button.setAttribute('aria-pressed',String(active))})}

  function buildLegend(){
    const host=$('layerLegend');
    WIDTHS.forEach((width,index)=>{
      const item=document.createElement('button'),dot=document.createElement('i');
      item.type='button'; item.dataset.layer=String(index); item.setAttribute('aria-pressed','false');
      item.setAttribute('aria-label',`Highlight layer ${index+1}, width ${width}`);
      dot.style.background=COLORS[index];
      item.append(dot,document.createTextNode(`Layer ${index+1} · width ${width}`));
      item.addEventListener('click',()=>{state.highlightedLayer=state.highlightedLayer===index?null:index;refreshLegend();render()});
      host.append(item);
    });
  }

  function showResult(key){
    const result=RESULTS[key]; document.querySelectorAll('[data-result]').forEach(button=>{const active=button.dataset.result===key;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});
    $('resultKicker').textContent=result.kicker; $('resultTitle').textContent=result.title; $('resultSummary').textContent=result.summary; $('resultBoundary').textContent=result.boundary;
    $('resultImage').src=`assets/naveed/${result.image}`; $('resultImage').alt=`${result.title}, submitted notebook result`;
    const second=$('resultImageSecondary'); if(result.secondary){second.hidden=false;second.src=`assets/naveed/${result.secondary}`;second.alt=`${result.title}, timing comparison`}else{second.hidden=true;second.removeAttribute('src')}
    const metrics=$('resultMetrics');metrics.replaceChildren();result.metrics.forEach(([value,label])=>{const box=document.createElement('div'),strong=document.createElement('strong'),small=document.createElement('small');strong.textContent=value;small.textContent=label;box.append(strong,small);metrics.append(box)});
  }

  const query = new URLSearchParams(window.location.search);
  const requestedFrame = Number(query.get('frame'));
  const requestedResult = RESULTS[query.get('result')] ? query.get('result') : 'figure2';
  if(Number.isInteger(requestedFrame)) state.index=Math.max(0,Math.min(DATA.frames.length-1,requestedFrame));
  buildLegend();
  slider.max=DATA.frames.length-1;
  slider.value=state.index;
  slider.addEventListener('input',()=>{stop();state.index=Number(slider.value);render()});
  $('playButton').addEventListener('click',play);
  document.querySelectorAll('[data-result]').forEach(button=>button.addEventListener('click',()=>showResult(button.dataset.result)));
  window.addEventListener('resize',()=>window.requestAnimationFrame(render));
  showResult(requestedResult); render();
})();
