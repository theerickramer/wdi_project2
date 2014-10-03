$(function(){

//CATEGORIES
	var CategoryView = Backbone.View.extend({

	});

	var CategoryModel = Backbone.Model.extend({
		urlRoot: '/categories'
	});

	var CategoryCollection = Backbone.Collection.extend({
		url: '/categories',
		model: CategoryModel
	});

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

			contactCollection.fetch();
		},

		addToList: function(item){
			var view = new ContactView({model: item});
			view.render();
			this.$el.append(view.el);
			console.log(view.el)// this seems to be the problem?
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
			'click .edit' : 'editContact',
			'click .delete' : 'deleteContact'
		},

		editContact: function(){
			this.model.set()
		// make inputs and set them 
			this.model.save();
		},

		deleteContact: function(){
			this.model.destroy();
		},

		render: function(){
			this.$el.html(this.template(this.model.attributes))
			console.log(this.$el);
		}


	});

	var FormView = Backbone.View.extend({
		events: {
			'click .add' : 'addContact',
		},

		addContact: function(){
			var name = this.$el.find('input[name="name"]').val();
			var age = this.$el.find('input[name="age"]').val();
			var address = this.$el.find('input[name="address"]').val(); 
			var phone = this.$el.find('input[name="phone"]').val(); 
			var picture = this.$el.find('input[name="picture"]').val(); 
			var cat_id = this.$el.find('input[name="cat_id"]').val(); 
			
			this.collection.create({
				name: name,
				age: age,
				address: address,
				phone_number: phone,
				picture: picture,
				category_id: cat_id
			})

			this.$el.find('input[name="name"]').val('');
			this.$el.find('input[name="age"]').val('');
			this.$el.find('input[name="address"]').val(''); 
			this.$el.find('input[name="phone"]').val(''); 
			this.$el.find('input[name="picture"]').val(''); 
			this.$el.find('input[name="cat_id"]').val('');
		}
	});

	var formView = new FormView({ el: $('.form'), collection: contactCollection});	



		








});