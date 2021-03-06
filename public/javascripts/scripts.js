$(function(){

	//CATEGORIES

	// var CategoryModel = Backbone.Model.extend({
	// 	urlRoot: '/categories'
	// });

	// var FriendsCollection = Backbone.Collection.extend({
	// 	url: '/categories/1',
	// 	model: CategoryModel
	// });

	// var friendsCollection = new FriendsCollection();

	// var FamilyCollection = Backbone.Collection.extend({
	// 	url: '/categories/2',
	// 	model: CategoryModel
	// });

	// var familyCollection = new FamilyCollection();

	// var WorkCollection = Backbone.Collection.extend({
	// 	url: '/categories/3',
	// 	model: CategoryModel
	// });

	// var workCollection = new WorkCollection();

	// var FriendsView = Backbone.View.extend({
	// 	initialize: function() {
	// 		this.listenTo(this.collection, 'change', this.addToFriendsList);

	// 		friendsCollection.fetch();
	// 	},

	// 	addToFriendsList: function(item){
	// 		var view = new FriendsView({model: item});
	// 		view.render();
	// 		console.log(view.el)
	// 		this.$el.append(view.el);
	// 	}
	// });

	// var FamilyView = Backbone.View.extend({
	// 	initialize: function() {

	// 		this.listenTo(this.collection, 'change', this.addToFamilyList);

	// 		familyCollection.fetch();
	// 	},

	// 	addToFamilyList: function(item){
	// 		var view = new FamilyView({model: item});
	// 		view.render();
	// 		this.$el.append(view.el);
	// 	}
	// });

	// var familyView = new FamilyView({collection: familyCollection, el: $('ul.family') });


	// var WorkView = Backbone.View.extend({
	// 	initialize: function() {
	// 		this.listenTo(this.collection, 'change', this.addToWorkList);

	// 		workCollection.fetch();
	// 	},

	// 	addToWorkList: function(item){
	// 		var view = new WorkView({model: item});
	// 		view.render();
	// 		this.$el.append(view.el);
	// 	}
	// });

	// var workView = new WorkView({collection: workCollection, el: $('ul.work') });

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

	var contactList = new ContactListView({collection: contactCollection, el: $('ul.all') });

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
			var cat_id = this.$el.find(('.dropdown option:selected')).val(); 
			var picture = this.$el.find('input[name="picture"]').val();
			
			var randomImage = false;

			if ($('.randomImage').prop('checked') == true) {
				$.ajax({
					url: 'http://api.randomuser.me/',
					dataType: 'json',
					success: function(data){
						var randomPicture = data.results[0].user.picture.thumbnail;
						createContact(randomPicture);
					}
				});
				randomImage = true;
			} else {
				createContact(picture);
			};

			function isEmpty(field) {
				if (field.val() == '') {
					field.css('border', '1px solid #F00');
				} 
			}

			function createContact(image){
				if (name != '' && age != '' && address != '' && phone != '' && image != '' && cat_id != '') {
					debugger;
					contactCollection.create({
						name: name,
						age: age,
						address: address,
						phone_number: phone,
						picture: image,
						category_id: cat_id
					});
				} else {
					function reopenModal() {
						$('.openModal').trigger('click');
						$('.modal-header').text('Please Complete All Fields');
						$('.modal-header').css('color', '#F00');
						$('.modal').find('input[name="name"]').val(name);
						$('.modal').find('input[name="age"]').val(age);
						$('.modal').find('input[name="address"]').val(address);
						$('.modal').find('input[name="phone"]').val(phone);
						$('.modal').find(('.dropdown option:selected')).val(cat_id);
						$('.modal').find('input[name="picture"]').val(picture);
						if (randomImage == true) {
							$('.randomImage').prop('checked', true);
							$('.modal').find('input[name="picture"]').val('random');
						}
						if (cat_id != '') {
							$('.modal').find('.dropdown option:selected').val(cat_id)
						}
						isEmpty($('.modal').find($('input[name="name"]')));
						isEmpty($('.modal').find($('input[name="age"]')));
						isEmpty($('.modal').find($('input[name="address"]')));
						isEmpty($('.modal').find($('input[name="phone"]')));
						if (randomImage == false) {
							isEmpty($('.modal').find($('input[name="picture"]')))
						};
						isEmpty($('.modal').find($('select')))
						$('.modal .btn').on('click', function(){
							$('.modal-header').text('');
						})

					}

					setTimeout(reopenModal, 500);
				}
			}

			

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

	// var AppRouter = Backbone.Router.extend({
	// 	routes: {
	// 		'all' : 'all',
	// 		'friends' : 'friends',
	// 		'family' : 'family',
	// 		'work' : 'work'
	// 	}
	// });

	// var router = new AppRouter;

	// router.on('route:form', function(){
	// 	var modal = $('.modal-content');
	// 	var formTemplate = _.template($('#form_template').html() )
	// 	modal.html(formTemplate);
	// })

	// router.on('route:contact', function(){
	// 	console.log('hello');
	// 	var contactTemplate = _.template($('#contact_template').html() )
	// 	var modal = $('.modal-body');
	// 	modal.html(contactTemplate);
	// })

	// router.on('route:friends', function(){
		
	// })

	// Backbone.history.start();

	$('button.openModal').on('click', function(){
		var modal = $('.modal-body');
		var formTemplate = _.template($('#form_template').html() )
		modal.html(formTemplate);
		var formFooter = _.template($('#modal_form_footer').html() );
		$('.modal-footer').html(formFooter);		
	})


	$('ul.all').sortable();

	$('li.friends').droppable({
		drop: function( event, ui ) {
      var model = contactCollection.findWhere({name: ui.draggable.context.innerText})
      model.set({category_id: 1});
      model.save();
      var currentList = $('.list').children().attr('class').split(' ')[0];
    	$('button.' + currentList).trigger('click');	
		}
	});
	$('li.family').droppable({
		drop: function( event, ui ) {
      var model = contactCollection.findWhere({name: ui.draggable.context.innerText})
      model.set({category_id: 2});
      model.save();
      var currentList = $('.list').children().attr('class').split(' ')[0];
    	$('button.' + currentList).trigger('click');	
		}
	});
	$('li.work').droppable({
		drop: function( event, ui ) {
      var model = contactCollection.findWhere({name: ui.draggable.context.innerText})
      model.set({category_id: 3});
      model.save();
      var currentList = $('.list').children().attr('class').split(' ')[0];
    	$('button.' + currentList).trigger('click');	
		}
	});



	$('.list').on('click', function(){
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
				var currentList = $('.list').children().attr('class').split(' ')[0];
	    	$('button.' + currentList).trigger('click');	
			});
			$('.delete').on('click', function(){
				model.destroy()
			});
		})

		function initializeMap() {
			var geocoder = new google.maps.Geocoder();
			var mapOptions = {
				zoom: 9,
				center: new google.maps.LatLng(-34.397, 150.644)
			};

			var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);

			function codeAddress() {
				var address = model.attributes.address;
				geocoder.geocode( { 'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						$('#myModal').on('shown.bs.modal', function(){
							google.maps.event.trigger(map, 'resize');
							map.setCenter(results[0].geometry.location);
						});
						var marker = new google.maps.Marker({
							map: map,
							position: results[0].geometry.location
						});
					} 
				});
			}

			codeAddress();

		}

		initializeMap();
	})

$('button.all').on('click', function(){
	$('.list').html('<ul class=all>')
	var all = contactCollection
	all.forEach(function(contact){
		$('ul.all').append('<li><a href="#" data-toggle="modal" data-target="#myModal">' + contact.attributes.name + '</a></li>')
	});
	$('ul.all').sortable();
});

$('button.friends').on('click', function(){
	$('.list').html('<ul class=friends>')
	var friends = contactCollection.where({category_id: 1});
	friends.forEach(function(friend){
		$('ul.friends').append('<li><a href="#" data-toggle="modal" data-target="#myModal">' + friend.attributes.name + '</a></li>')
	});
	$('ul.friends').sortable();
});

$('button.family').on('click', function(){
	$('.list').html('<ul class=family>')
	var family = contactCollection.where({category_id: 2});
	family.forEach(function(member){
		$('ul.family').append('<li><a href="#" data-toggle="modal" data-target="#myModal">' + member.attributes.name + '</a></li>')
	});
	$('ul.family').sortable();
});

$('button.work').on('click', function(){
	$('.list').html('<ul class=work>')
	var work = contactCollection.where({category_id: 3});
	work.forEach(function(worker){
		$('ul.work').append('<li><a href="#" data-toggle="modal" data-target="#myModal">' + worker.attributes.name + '</a></li>')
	});
	$('ul.work').sortable();
});

$('input.search').on('keyup', function(){
	$('.list').html('<ul class=searchResults>')
	var contacts = contactCollection.models;
	var results = _.filter(contacts, function(contact){
		return contact.attributes.name.toLowerCase().indexOf($('input.search').val().toLowerCase()) != -1
	});
	results.forEach(function(result){
		$('ul.searchResults').append('<li><a href="#" data-toggle="modal" data-target="#myModal">' + result.attributes.name + '</a></li>')
	});
})

});