// Userlist data array for filling in info box
var prodListData = [];

// DOM Ready =============================================================
$('#prodList table tbody').on('click', 'td a.linkshowprod', showProdInfo);
// Add User button click
$('#btnAddProd').on('click', addProd);

$('#prodList table tbody').on('click','td a.linkdeleteprod', deleteProd)

$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

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
			tableContent += '<td>' + this.price + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteprod" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#prodList table tbody').html(tableContent);
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
	    $('#prodInfoPrice').text(thisProdObject.price);
	    $('#prodInfoId').text(thisProdObject._id);
};


/*
function addProd(event){
	event.preventDefault();
	
	var errorCount = 0;
	$('#addProd input').each(function(index,val){
		if($(this).val() === '') { errorCount++; }
	});
	
	if(errorCount === 0){
		
		var newProd = {
			'name': $('#addProd fieldset input#inputProdName').val(),
			'price': $('#addProd fieldset input#inputPrice').val()
		}
	
		$.ajax({
			type: 'POST',
			data: newProd,
			url: '/users/addprod'
			dataType: 'JSON'
		}).done(function(response){
			if(response.msg === ''){
				$('#addProd fieldset input').val('');
			
				populateTable();
			}
			else{
				alert('Error: '+reponse.msg);
			}
		});
	}	
	else{
		alert('Please fill in all fields');
		return false;
	}

}; */



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
            'price': $('#addProd fieldset input#inputPrice').val()
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

/*
function deleteProd(event){
	event.preventDefault();
	
	var confirmation = confirm('Are sure want to un follow this product?');
	
	if(confirmation === true){
		$.ajax({
			type: 'DELETE',
			url: 'users/delprod/' + $(this).attr)('rel')
		}).done(function(response){
			if(response.msg === ''){
				
			}
			else{
				alert('Error: ' + response.msg);
			}
			populateTable();
		});
	}
	else
	{
		return false;
		
	}
}; */

// Delete User
function deleteProd(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to un Subscribe this product?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/delprod/' + $(this).attr('rel')
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
