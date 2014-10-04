$(function(){

	//CATEGORIES

	var CategoryModel = Backbone.Model.extend({
		urlRoot: '/categories'
	});

	var FriendsCollection = Backbone.Collection.extend({
		url: '/categories/1',
		model: CategoryModel
	});

	var friendsCollection = new FriendsCollection();

	var FamilyCollection = Backbone.Collection.extend({
		url: '/categories/2',
		model: CategoryModel
	});

	var familyCollection = new FamilyCollection();

	var WorkCollection = Backbone.Collection.extend({
		url: '/categories/3',
		model: CategoryModel
	});

	var workCollection = new WorkCollection();

	var FriendsView = Backbone.View.extend({
		initialize: function() {
			this.listenTo(this.collection, 'change', this.addToFriendsList);

			friendsCollection.fetch();
		},

		addToFriendsList: function(item){
			var view = new FriendsView({model: item});
			view.render();
			console.log(view.el)
			this.$el.append(view.el);
		}
	});

	var friendsView = new FriendsView({collection: friendsCollection, el: $('ul.friends') });

	var FamilyView = Backbone.View.extend({
		initialize: function() {

			this.listenTo(this.collection, 'change', this.addToFamilyList);

			familyCollection.fetch();
		},

		addToFamilyList: function(item){
			var view = new FamilyView({model: item});
			view.render();
			this.$el.append(view.el);
		}
	});

	var familyView = new FamilyView({collection: familyCollection, el: $('ul.family') });


	var WorkView = Backbone.View.extend({
		initialize: function() {
			this.listenTo(this.collection, 'change', this.addToWorkList);

			workCollection.fetch();
		},

		addToWorkList: function(item){
			var view = new WorkView({model: item});
			view.render();
			this.$el.append(view.el);
		}
	});

	var workView = new WorkView({collection: workCollection, el: $('ul.work') });

	//CONTACTS	
	var ContactModel = Backbone.Model.extend({
		urlRoot: '/contacts'
	});

	var ContactCollection = Backbone.Collection.extend({
		url: '/contacts',
		model: ContactModel
	});

	contactCollection = new ContactCollection();

	var ContactListView = Backbone.View.extend({
		initialize: function() {
			this.listenTo(this.collection, 'add', this.addToList);
			this.collection.fetch();
		},

		addToList: function(item){
			var view = new ContactView({model: item});
			view.render();
			this.$el.append(view.el);
		}
	});

	var contactList = new ContactListView({collection: contactCollection, el: $('ul.list') });

	var ContactView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#list_template').html() ),

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy remove', this.remove);
		},

		events: {
			'click .update' : 'updateContact',
			'click .delete' : 'deleteContact'
		},

		updateContact: function(){
			this.model.set(this.model.attributes)
			// make inputs and set them 
			this.model.save();
		},

		deleteContact: function(){
			this.model.destroy();
		},

		render: function(){

			this.$el.html(this.template(this.model.attributes))
		}


	});

	var FormView = Backbone.View.extend({
		events: {
			'click .save' : 'addContact',
		},

		addContact: function(){
			var name = this.$el.find('input[name="name"]').val();
			var age = this.$el.find('input[name="age"]').val();
			var address = this.$el.find('input[name="address"]').val(); 
			var phone = this.$el.find('input[name="phone"]').val(); 
			var picture = this.$el.find('input[name="picture"]').val(); 
			var cat_id = this.$el.find(('.dropdown option:selected')).val(); 

			this.collection.create({
				name: name,
				age: age,
				address: address,
				phone_number: phone,
				picture: picture,
				category_id: cat_id
			})

			// this.$el.find('input[name="name"]').val('');
			// this.$el.find('input[name="age"]').val('');
			// this.$el.find('input[name="address"]').val(''); 
			// this.$el.find('input[name="phone"]').val(''); 
			// this.$el.find('input[name="picture"]').val(''); 
			// this.$el.find('input[name="cat_id"]').val('');
		}
	});

	var formView = new FormView({ el: $('.modal'), collection: contactCollection});	

	function render(){
		this.view.render
	}

	// Router

	var AppRouter = Backbone.Router.extend({
		routes: {
			'all' : 'all',
			'friends' : 'friends',
			'family' : 'family',
			'work' : 'work'
		}
	});

	var router = new AppRouter;

	router.on('route:form', function(){
		var modal = $('.modal-content');
		var formTemplate = _.template($('#form_template').html() )
		modal.html(formTemplate);
	})

	router.on('route:contact', function(){
		console.log('hello');
		var contactTemplate = _.template($('#contact_template').html() )
		var modal = $('.modal-body');
		modal.html(contactTemplate);
	})

	router.on('route:friends', function(){
		console.log('hello');
	})

	Backbone.history.start();

	$('button.openModal').on('click', function(){
		var modal = $('.modal-body');
		var formTemplate = _.template($('#form_template').html() )
		modal.html(formTemplate);
		var formFooter = _.template($('#modal_form_footer').html() );
		$('.modal-footer').html(formFooter);
	})

	$('ul.list').on('click', function(){
		var contactTemplate = _.template($('#contact_template').html() );
		// var model = contactCollection.get(event.target.id);
		var model = contactCollection.findWhere({name: event.target.text});
		var modal = $('.modal-body');
		modal.html(contactTemplate(model.attributes));
		var contactFooter = _.template($('#modal_contact_footer').html() );
		$('.modal-footer').html(contactFooter);
		$('.edit').on('click', function(){
			var editTemplate = _.template($('#edit_template').html() );
			modal.html(editTemplate(model.attributes));
			var editFooter = _.template($('#modal_edit_footer').html() );
			$('.modal-footer').html(editFooter);
			$('.update').on('click', function(){
				var name = modal.find('input[name="name"]').val();
				var age = modal.find('input[name="age"]').val();
				var address = modal.find('input[name="address"]').val(); 
				var phone = modal.find('input[name="phone"]').val(); 
				var picture = modal.find('input[name="picture"]').val(); 
				var cat_id = modal.find(('.dropdown option:selected')).val(); 
				model.set({
					name: name,
					age: age,
					address: address,
					phone_number: phone,
					picture: picture,
					category_id: cat_id
				});
				model.save();
			});
			$('.delete').on('click', function(){
				model.destroy()
			});
		})
	})


});