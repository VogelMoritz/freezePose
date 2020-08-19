// Keyframe wird zu Time kopiert, Keyframes von Time werden zu Hold zur rechten, Tangenten zur Linken sind Null

app.beginUndoGroup('FreezePose');

var hold = new KeyframeEase(0,0.1);
var currentComp = app.project.activeItem;
var layers = currentComp.numLayers;

for (var i = 1; i <= layers; i++){
	var layer = currentComp.layers[i];
	
	if (layer.enabled && !layer.locked && !layer.shy){
		propCycle(layer);
	};
};

app.endUndoGroup();


function propCycle (container){
    var props = container.numProperties;
   
    for (var j = 1; j <= props; j++){
            var prop = container.property(j);

		if (prop.numKeys > 0 && prop.matchName != "ADBE Marker"){
			
					
			time = currentComp.time;
			lastKeyIndex = prop.nearestKeyIndex(time);
			if (prop.keyTime(lastKeyIndex) > time && lastKeyIndex > 1){
				lastKeyIndex--};
			
			lastKeyValue = prop.keyValue(lastKeyIndex);
			
			try{	
				InterpolIn = prop.keyInInterpolationType(lastKeyIndex);
				prop.setValueAtTime(time, lastKeyValue);
								
				if (prop.keyOutInterpolationType(lastKeyIndex) == KeyframeInterpolationType.BEZIER){

				
					lastKeyEaseIn = prop.keyInTemporalEase(lastKeyIndex);	
					prop.setTemporalEaseAtKey(lastKeyIndex, lastKeyEaseIn, [hold]);
					prop.setTemporalEaseAtKey(lastKeyIndex+1, [hold]);
				}

				prop.setInterpolationTypeAtKey(lastKeyIndex+1, InterpolIn, KeyframeInterpolationType.HOLD);

			} catch(err){
				alert("Error at line: " + err.line.toString() + "\r" + err.toString());

			};
		
		};
		
		if (prop.numProperties > 0){
			propCycle(prop);
		};

    };        
};