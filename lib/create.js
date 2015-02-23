var utilities = require('utilities');

// Generates a smart Create method
var create = function (controller, Model, opts) {

  var key = utilities.string.camelize( Model.modelName );

	var action = function (req, res, params, next){

    var opts = params[ key ];
		var model = Model.create(opts);

		if(!model.isValid()){
			return finishRender(model);
		}

		model.save(afterSave);

		function afterSave(err, model){
			if(err) { throw err; };

			if(next){
				// Callback custom callback
				next(err, model, finishRender);
			}else if(opts.beforeRender){
				// Callback beforeRender
				opts.beforeRender(err, model, finishRender);
			}else{
				// Render if no beforeRender setted
				finishRender(model);
			}
		}

		function finishRender(models){
			controller.respondWith(models, {type: Model.modelName});
		}
	};

	// Register method in controller
	controller[opts.action] = action;
}

module.exports = create;
