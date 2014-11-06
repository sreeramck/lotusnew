// Userlist data array for filling in info box
var prodListData = [];
var resultListData = [];

// DOM Ready =============================================================
$('#prodList table tbody').on('click', 'td a.linkshowprod', showProdInfo);
// Add User button click
$('#btnAddProd').on('click', addProd);


$('#btnSearProd').on('click', searProd);

$('#prodList table tbody').on('click','td a.linkdeleteprod', deleteUser);

$(document).ready(function() {

	// Populate the user table on initial page load
	populateTable();
	//searchTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/users/prodlist', function( data ) {
		
		// Stick our user data array into a userlist variable in the global object
		prodListData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowprod" rel="' + this.name + '" title="Watch List">' + this.name + '</a></td>';
			tableContent += '<td>' + this.salePrice + '</td>';
			tableContent += '<td>' + this.priceUpdateDate + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteprod" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#prodList table tbody').html(tableContent);
	});
};




// Fill table with data
function searchTable() {

	// Empty content string
	var tableContent = '';
	var url = "http://api.remix.bestbuy.com/v1/products(search=mac)?apiKey=2be878xcfkfqkxa5usbaum5b&format=json&callback=?";

	// jQuery AJAX call for JSON
	$.getJSON(url,function(data) {
		
		alert('Success');
		
		// Stick our user data array into a userlist variable in the global object
		// resultListData = data.products;
		//alert(resultListData);

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td>' + this.name + '</td>';
			tableContent += '<td>' + this.salePrice + '</td>';
			tableContent += '<td>' + this.sku + '</td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#resultList table tbody').html(tableContent);
	});
};


function searchTable1() {

	// Empty content string
	var tableContent = '';
	
	$.ajax({
		type: "GET",
		crossDomain: 'true',
		url: "http://api.remix.bestbuy.com/v1/products(search=mac)?apiKey=2be878xcfkfqkxa5usbaum5b&format=json&callback=?",
		cache: false,
		success: function(json) {
			 alert('success');
			console.log(json); 
			 var data = $.parseJSON(json);
			 console.log(data); 
			 // resultListData = data.products;
			  console.log(data.from);
			// alert(data.from);
			$.each(data, function(){
				tableContent += '<tr>';
				tableContent += '<td>' + this.from + '</td>';
				tableContent += '<td>' + this.totalPages + '</td>';
				tableContent += '<td>' + this.sku + '</td>';
				tableContent += '</tr>';
			});
			$('#resultList table tbody').html(tableContent);
			
		},
		dataType: 'jsonp'
	 
	});
};




// Show User Info
function showProdInfo(event) {

	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve username from link rel attribute
	var thisProdName = $(this).attr('rel');

	// Get Index of object based on id value
	var arrayPosition = prodListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisProdName);

	// Get our User Object
	var thisProdObject = prodListData[arrayPosition];

	//Populate Info Box
	$('#prodInfoName').text(thisProdObject.name);
	$('#prodInfoPrice').text(thisProdObject.salePrice);
	$('#prodInfoTime').text(thisProdObject.priceUpdateDate);
		
	var logContent = '';
		
	$.each(thisProdObject.log, function(){
		logContent += '<tr>';
		logContent += '<td>' + this.hPrice + '</td>';
		logContent += '<td> as on ' + this.hTime + '</td>';
		logContent += '</tr>';
	});

	// Inject the whole content string into our existing HTML table
	$('#prodInfo table tbody').html(logContent);
};



// Add User
function addProd(event) {
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addProd input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {

		// If it is, compile all user info into one object
		var newProd = {
			'name': $('#addProd fieldset input#inputProdName').val(),
			'salePrice': $('#addProd fieldset input#inputPrice').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newProd,
			url: '/users/addprod',
			dataType: 'JSON'
		}).done(function( response ) {

			// Check for successful (blank) response
			if (response.msg === '') {

				// Clear the form inputs
				$('#addProd fieldset input').val('');
				console.log("This is loggggggggggggg!!!");
				// Update the table
				populateTable();

			}
			else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);

			}
		});
	}
	else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
};


// Delete User
function deleteUser(event) {

	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this product?');

	// Check and make sure the user confirmed
	if (confirmation === true) {

		// If they did, do our delete
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function( response ) {

			// Check for a successful (blank) response
			if (response.msg === '') {
			}
			else {
				alert('Error: ' + response.msg);
			}

			// Update the table
			populateTable();

		});

	}
	else {

		// If they said no to the confirm, do nothing
		return false;

	}

};


function searProd(event) {
	event.preventDefault();
	// searchTable();
	// $.ajax({
		// 		type: "GET",
		// 		url: "http://api.remix.bestbuy.com/v1/products(search=mac)?apiKey=2be878xcfkfqkxa5usbaum5b&format=json&callback=?",
		// 		cache: false,
		// 		success: function() {
			// 			alert('success');
			//
			// 		},
			//	dataType: 'json'});


			searchTable1();
		};


		/*


		// Search User
		function searProd(event) {
		event.preventDefault();
		//
		// Super basic validation - increase errorCount variable if any fields are blank
		var errorCount = 0;
		$('#searProd input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
		});
		//
		// Check and make sure errorCount's still at zero
		if(errorCount === 0) {

		//         // If it is, compile all user info into one object
		var newProd = {
		'name': $('#searProd fieldset input#inputProdName').val(),
		}
	
	
		var tableContent = '';

		// jQuery AJAX call for JSON
		$.getJSON( '/users/prodlist', function( data ) {
		
		// Stick our user data array into a userlist variable in the global object
		resultListData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
		tableContent += '<tr>';
		tableContent += '<td><a href="#" class="linkshowprod" rel="' + this.name + '" title="Watch List">' + this.name + '</a></td>';
		tableContent += '<td>' + this.salePrice + '</td>';
		tableContent += '<td>' + this.priceUpdateDate + '</td>';
		tableContent += '<td><a href="#" class="linkdeleteprod" rel="' + this._id + '">delete</a></td>';
		tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#prodList table tbody').html(tableContent);
	
	
		$.ajax({
		type: "GET",
		url: "http://api.remix.bestbuy.com/v1/products(search=mac)?apiKey=2be878xcfkfqkxa5usbaum5b&format=json&callback=?",
		cache: true,
		success: function(data) {
		alert('success');
		// alert(data);
			
		$("#resultList").empty().append(data);
		},
		dataType: 'json'
		}).done(function( response ) {
		//
		// Check for successful (blank) response
		if (response.msg === '') {

		// Clear the form inputs
		$('#searProd fieldset input').val('');
		console.log("This is loggggggggggggg!!!");
		// Update the table
		// populateTable();

		}
		else {

		//                 If something goes wrong, alert the error message that our service returned
		alert('Error: ' + response.msg);

		}
		});
		}
		else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
		}
		}; */