//Created using the help of the leaderboard example on the firebase tutorial

  // Create our Firebase reference
  var attendeesRef = new Firebase('https://naranjo.firebaseio-demo.com//List_Of_Attendees');

  // Keep a mapping of firebase locations to HTML elements, so we can move/remove elements as necessary.
  var htmlForPath = {};

  // Helper function that takes a new attendee snapshot and adds an appropriate row to our list of attendees
  function attendeeAdded(attendeeSnapshot, prevAttendeeName) {
    var newAttendeeRow = $("<tr/>");
    newAttendeeRow.append($("<td/>").append($("<em/>").text(attendeeSnapshot.val().name)));
    newAttendeeRow.append($("<td/>").append($("<em/>").text(attendeeSnapshot.val().organization)));
    newAttendeeRow.append($("<td/>").append($("<em/>").text(attendeeSnapshot.val().phone)));
    
    // Store a reference to the table row so we can get it again later.
    htmlForPath[attendeeSnapshot.key()] = newAttendeeRow;

    // Insert the new attendee in the appropriate place in the table.
    if (prevAttendeeName === null) {
      $("#attendeeTable").append(newAttendeeRow);
    }
    else {
      var prevAttendeeRow = htmlForPath[prevAttendeeName];
      prevAttendeeRow.before(newAttendeeRow);
    }
  }

  // Helper function to handle a attendee being removed; just removes the corresponding table row.
  function attendeeRemoved(attendeeSnapshot) {
    var removedAttendeeRow = htmlForPath[attendeeSnapshot.key()];
    removedAttendeeRow.remove();
    delete htmlForPath[attendeeSnapshot.key()];
  }

  // Add a callback to handle when a new attendee is added.
  attendeesRef.on('child_added', function (newAttendeeSnapshot, prevAttendeeName) {
    attendeeAdded(newAttendeeSnapshot, prevAttendeeName);
  });

  // Add a callback to handle when an attendee is removed.
  attendeesRef.on('child_removed', function (oldAttendeeSnapshot) {
    attendeeRemoved(oldAttendeeSnapshot);
  });

  // Add a callback to handle when an attendee changes or moves positions.
  var changedCallback = function (attendeeSnapshot, prevAttendeeName) {
    attendeeRemoved(attendeeSnapshot);
    attendeeAdded(attendeeSnapshot, prevAttendeeName);
  };
  
  attendeesRef.on('child_moved', changedCallback);
  attendeesRef.on('child_changed', changedCallback);

  //Sets attendee on the database once submit button is clicked
   $("#submitattendee").click(function(){
           var newOrganization = $("#orgInput").val();
           var newContact = Number($("#contactInput").val());
           var name = $("#nameInput").val();
           if(isNaN(newContact) || newContact == ''){ Materialize.toast("Must input numbers for contact number", 1000); return;}
           if(name == ''){ Materialize.toast("Name of attendee missing.", 1000); return;}
           if(newOrganization == ''){ Materialize.toast("Organization of attendee missing", 1000); return;}
           
           Materialize.toast(name + " has been added to the Attendees section.", 1000); 
           $("#nameInput").val("");
           $("#contactInput").val("");
           $("#orgInput").val("");
           
           if (name.length === 0)
             return;

           var attendeesListRef = attendeesRef.child(name);
           attendeesListRef.setWithPriority({ name:name, organization:newOrganization, phone:newContact }, newContact);

  });
  
  //Sets attendee on the database once enter is pressed on the text field
  var addAttendee = function(e){
      if (e.keyCode == 13) {
           var newOrganization = $("#orgInput").val();
           var newContact = Number($("#contactInput").val());
           var name = $("#nameInput").val();
           if(isNaN(newContact) || newContact == ''){ Materialize.toast("Must input numbers for contact number", 1000); return;}
           if(name == ''){ Materialize.toast("Name of attendee missing.", 1000); return;}
           if(newOrganization == ''){ Materialize.toast("Organization of attendee missing", 1000); return;}
           
           Materialize.toast(name + " has been added to the Attendees section.", 1000); 
           $("#nameInput").val("");
           $("#contactInput").val("");
           $("#orgInput").val("");
           
           if (name.length === 0)
             return;

           var attendeesListRef = attendeesRef.child(name);
           attendeesListRef.setWithPriority({ name:name, organization:newOrganization, phone:newContact }, newContact);
     }
  };
  
  $("#nameInput").keypress(addAttendee);
  $("#orgInput").keypress(addAttendee);
  $("#contactInput").keypress(addAttendee);
  
