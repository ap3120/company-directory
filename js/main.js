let itemToDelete = '';

$('#select').on('change', () => {
    const item = $('#select').val();
    if (item === 'personnel') {
        $('.location-table').hide();
        $('.department-table').hide();
        $('.personnel-table').show();
    } else if (item === 'department') {
        $('.location-table').hide();
        $('.department-table').show();
        $('.personnel-table').hide();
    } else {
        $('.location-table').show();
        $('.department-table').hide();
        $('.personnel-table').hide();
    }
});

$('#select').val('personnel').change();

const deleteLocationById = (id, ln) => {
    $.ajax({
        type: 'POST',
        url: 'php/checkDepartmentUse.php',
        data: {id: id},
        dataType: 'json',
        success: res => {
            if (res.data[0].locationCount === 0) {
                itemToDelete = 'location';
                $('#item-to-delete-id').val(id);
                $('#confirm-delete-modal-title').html('Deleting location ' + ln);
                $('#confirm-delete-modal-body').html('location');
                $('#confirm-delete-modal').modal('show');
            } else {
                $('#cant-delete-modal-title').html('Cannot remove location ' + ln);
                $('#cant-delete-modal-body').html('This location cannot be deleted. ' + res.data[0].locationCount + ' departments are associated to it.')
                $('#cant-delete-modal').modal('show');
            }
        }
    })
}

$('#delete-button').on('click', () => {
    let url;
    const id = $('#item-to-delete-id').val();
    if (itemToDelete === 'location') {
        url = 'php/deleteLocationById.php';
    } else if (itemToDelete === 'department') {
        url = 'php/deleteDepartmentById.php';
    } else {
        url = 'php/deletePersonnelById.php';
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: {id: id},
        dataType: 'json',
        success: res => {
            $('#confirm-delete-modal').modal('hide');
            const toast = new bootstrap.Toast($('#success-toast'))
            $('.toast-body').html(res.data);
            toast.show();
            getAllLocation();
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown);
        }
    });
});

// get all location
const addLocationToList = (id, ln, setDropdown = false) => {
    $('#location-list').append(`
        <tr>
            <td>
                ${ln}
            </td>
            <td class="right">
                <button data-id="${id}" type="button" class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#elm"><i class="fa-regular fa-eye"></i></button>
                <button data-id="${id}" type="button" class="btn btn-danger" onclick="deleteLocationById(${id}, '${ln}')"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        </tr>
    `);

    if (setDropdown) {
        $('#location').append(`
            <option value="${id}">${ln}</option>
        `);
    }
}

const getAllLocation = () => {
    $.ajax({
        type: 'POST',
        url: 'php/getAllLocation.php',
        data: {},
        dataType: 'json',
        success: res => {
            getAllDepartment();
            $('#location-list').empty();
            $('#location').empty();
            for (let i=0; i<res.data.length; i++) {
                addLocationToList(res.data[i].id, res.data[i].name, true);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown);
        }
    });
}
getAllLocation();

const deleteDepartmentById = (id, dn) => {
    $.ajax({
        type: 'POST',
        url: 'php/checkPersonnelUse.php',
        data: {id: id},
        dataType: 'json',
        success: res => {
            if (res.data[0].departmentCount === 0) {
                itemToDelete = 'department';
                $('#item-to-delete-id').val(id);
                $('#confirm-delete-modal-title').html('Deleting department ' + dn);
                $('#confirm-delete-modal-body').html('department');
                $('#confirm-delete-modal').modal('show');
            } else {
                $('#cant-delete-modal-title').html('Cannot remove department ' + dn);
                $('#cant-delete-modal-body').html('This department cannot be deleted. ' + res.data[0].departmentCount + ' personnels are associated to it.')
                $('#cant-delete-modal').modal('show');
            }
        }
    })
}

// get all department
const addDepartmentToList = (id, dn, loc, locname, setDropdown=false) => {
    $('#department-list').append(`
        <tr>
            <td>
                ${dn}
            </td>
            <td class="d-none d-sm-table-cell">
                ${locname}
            </td>
            <td class="right">
                <button data-id="${id}" type="button" class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#edm"><i class="fa-regular fa-eye"></i></button>
                <button data-id="${id}" type="button" class="btn btn-danger" onclick="deleteDepartmentById(${id}, '${dn}')"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        </tr>
    `);

    if (setDropdown) {
        $('#department').append(`
            <option value=${id}>${dn}</option>
        `);
    }

}

const getAllDepartment = () => {
    $.ajax({
        type: 'POST',
        url: 'php/getAllDepartment.php',
        data: {},
        dataType: 'json',
        success: res => {
            getAllPersonnel();
            $('#department-list').empty();
            $('#department').empty();
            for (let i=0; i<res.data.length; i++) {
                addDepartmentToList(res.data[i].id, res.data[i].name, res.data[i].locationID, res.data[i].locname, true);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown);
        }
    });
}
//getAllDepartment();

const deletePersonnelById = (id, fn, ln) => {
    itemToDelete = 'personnel';
    $('#item-to-delete-id').val(id);
    $('#confirm-delete-modal-title').html('Deleting personnel ' + fn + ' ' + ln);
    $('#confirm-delete-modal-body').html('personnel');
    $('#confirm-delete-modal').modal('show');
}

// get all personnel
const addPersonnelToList = (id, fn, ln, jt, email, dep, depname, locname) => {
    $('#personnel-list').append(`
        <tr>
            <td>
                ${fn} ${ln}
            </td>
            <td class="d-none d-sm-table-cell">
                ${jt}
            </td>
            <td class="d-none d-md-table-cell">
                ${email}
            </td>
            <td class="d-none d-lg-table-cell">
                ${depname}
            </td>
            <td class="d-none d-xl-table-cell">
                ${locname}
            </td>
            <td class="right">
                <button data-id="${id}" type="button" class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#epm"><i class="fa-regular fa-eye"></i></button>
                <button data-id="${id}" type="button" class="btn btn-danger" onclick="deletePersonnelById(${id}, '${fn}', '${ln}')"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        </tr>
    `);
}

const getAllPersonnel = () => {
    $.ajax({
        type: 'POST',
        url: 'php/getAllPersonnel.php',
        data: {},
        dataType: 'json',
        success: res => {
            $('#personnel-list').empty();
            for (let i=0; i<res.data.length; i++) {
                addPersonnelToList(res.data[i].id, res.data[i].firstName, res.data[i].lastName, res.data[i].jobTitle, res.data[i].email, res.data[i].departmentID, res.data[i].depname, res.data[i].locname);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown);
        }
    });
}

// add personnel
$(document).on('submit', '#create-personnel', (e) => {
    e.preventDefault();
    const fn = $('#fname').val();
    const ln = $('#lname').val();
    const jt = $('#job').val();
    const email = $('#email').val();
    const dep = $('#department').val();
    if (fn === '' || ln === '' || jt === '' || email === '') {
        const toast = new bootstrap.Toast($('#alert-toast'))
        $('.toast-body').html('All fields are required.');
        toast.show()

    } else {
        $.ajax({
            type: 'POST',
            url: 'php/createPersonnel.php',
            data: {
                firstName: fn,
                lastName: ln,
                jobTitle: jt,
                email: email,
                departmentID: dep
            },
            dataType: 'json',
            success: res => {
                $('#create-personnel')[0].reset();
                const toast = new bootstrap.Toast($('#success-toast'))
                $('.toast-body').html('Personnel successfully added.');
                toast.show()
                $('#cpm').modal('hide');
                getAllPersonnel();

            },
            error: (jqXHR, textStatus, errorThrown) => {
                const toast = new bootstrap.Toast($('#alert-toast'))
                $('.toast-body').html('Something went wrong, personnel was not added.');
                toast.show()
            }
        })
    }

})

// add department
$(document).on('submit', '#create-department', (e) => {
    e.preventDefault();
    const dn = $('#dname').val();
    const loc = $('#location').val();
    if (dn === '') {
        const toast = new bootstrap.Toast($('#alert-toast'))
        $('.toast-body').html('All fields are required.');
        toast.show()

    } else {
        $.ajax({
            type: 'POST',
            url: 'php/createDepartment.php',
            data: {
                name: dn,
                locationID: loc
            },
            dataType: 'json',
            success: res => {
                console.log(res);
                $('#create-department')[0].reset();
                const toast = new bootstrap.Toast($('#success-toast'))
                $('.toast-body').html('Department successfully added.');
                toast.show()
                $('#cdm').modal('hide');
                getAllDepartment();

            },
            error: (jqXHR, textStatus, errorThrown) => {
                const toast = new bootstrap.Toast($('#alert-toast'))
                $('.toast-body').html('Something went wrong, department was not added.');
                toast.show()
            }
        })
    }

})

// add location
$(document).on('submit', '#create-location', (e) => {
    e.preventDefault();
    const locn = $('#locname').val();
    if (locn === '') {
        const toast = new bootstrap.Toast($('#alert-toast'))
        $('.toast-body').html('All fields are required.');
        toast.show()

    } else {
        $.ajax({
            type: 'POST',
            url: 'php/createLocation.php',
            data: {
                name: locn,
            },
            dataType: 'json',
            success: res => {
                console.log(res);
                $('#create-location')[0].reset();
                const toast = new bootstrap.Toast($('#success-toast'))
                $('.toast-body').html('Location successfully added.');
                toast.show()
                $('#clm').modal('hide');
                getAllLocation();

            },
            error: (jqXHR, textStatus, errorThrown) => {
                const toast = new bootstrap.Toast($('#alert-toast'))
                $('.toast-body').html('Something went wrong, location was not added.');
                toast.show()
            }
        })
    }

})

// edit personnel
$('#edit-personnel').on('submit', (e) => {
    e.preventDefault();
    const id = $('#personnel-id').val();
    const fn = $('#edit-fname').val();
    const ln = $('#edit-lname').val();
    const jt = $('#edit-job').val();
    const email = $('#edit-email').val();
    const dep = $('#edit-dep').val();
    if (fn === '' || ln === '' || jt === '' || email === '') {
        const toast = new bootstrap.Toast($('#alert-toast'))
        $('.toast-body').html('All fields are required.');
        toast.show()

    } else {
        $.ajax({
            type: 'POST',
            url: 'php/updatePersonnelById.php',
            data: {
                firstName: fn,
                lastName: ln,
                jobTitle: jt,
                email: email,
                departmentID: dep,
                id: id
            },
            dataType: 'json',
            success: res => {
                const toast = new bootstrap.Toast($('#success-toast'))
                $('.toast-body').html('Personnel successfully edited.');
                toast.show()
                $('#epm').modal('hide');
                getAllPersonnel();

            },
            error: (jqXHR, textStatus, errorThrown) => {
                const toast = new bootstrap.Toast($('#alert-toast'))
                $('.toast-body').html('Something went wrong, personnel was not edited.');
                toast.show()
            }
        })
    }

})

// setting the edit personnel modal before opening it
$('#epm').on('show.bs.modal', function (e) {

    $.ajax({
        url: "php/getPersonnelById.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {

            var resultCode = result.status.code

            if (resultCode == 200) {
                $('#edit-personnel-modal').html(result.data.personnel[0].firstName + ' ' + result.data.personnel[0].lastName);
                $('#personnel-id').val(result.data.personnel[0].id);
                $('#edit-fname').val(result.data.personnel[0].firstName);
                $('#edit-lname').val(result.data.personnel[0].lastName);
                $('#edit-job').val(result.data.personnel[0].jobTitle);
                $('#edit-email').val(result.data.personnel[0].email);

                $('#edit-dep').html("");

                $.each(result.data.department, function () {

                    $('#edit-dep').append($("<option>", {
                        value: this.id,
                        text: this.name
                    })); 	

                })
                $('#edit-dep').val(result.data.personnel[0].departmentID).change();

            } else {

                $('#epm .modal-title').replaceWith("Error retrieving data");

            } 

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#epm .modal-title').replaceWith("Error retrieving data");
        }
    });

})

// edit department
$('#edit-department').on('submit', (e) => {
    e.preventDefault();
    const id = $('#department-id').val();
    const dn = $('#edit-dname').val();
    const loc = $('#edit-loc').val();
    if (dn === '') {
        const toast = new bootstrap.Toast($('#alert-toast'))
        $('.toast-body').html('All fields are required.');
        toast.show()

    } else {
        $.ajax({
            type: 'POST',
            url: 'php/updateDepartmentById.php',
            data: {
                name: dn,
                locationID: loc,
                id: id
            },
            dataType: 'json',
            success: res => {
                const toast = new bootstrap.Toast($('#success-toast'))
                $('.toast-body').html('Department successfully edited.');
                toast.show()
                $('#edm').modal('hide');
                getAllDepartment();

            },
            error: (jqXHR, textStatus, errorThrown) => {
                const toast = new bootstrap.Toast($('#alert-toast'))
                $('.toast-body').html('Something went wrong, department was not edited.');
                toast.show()
            }
        })
    }

})

// setting the edit department modal before opening it
$('#edm').on('show.bs.modal', function (e) {

    $.ajax({
        url: "php/getDepartmentById.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {

            var resultCode = result.status.code

            if (resultCode == 200) {
                $('#edit-department-modal').html(result.data.department[0].name);
                $('#department-id').val(result.data.department[0].id);
                $('#edit-dname').val(result.data.department[0].name);

                $('#edit-loc').html("");

                $.each(result.data.location, function () {

                    $('#edit-loc').append($("<option>", {
                        value: this.id,
                        text: this.name
                    })); 	

                })
                $('#edit-loc').val(result.data.department[0].locationID).change();

            } else {

                $('#epm .modal-title').replaceWith("Error retrieving data");

            } 

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#epm .modal-title').replaceWith("Error retrieving data");
        }
    });

})

// edit location
$('#edit-location').on('submit', (e) => {
    e.preventDefault();
    const id = $('#location-id').val();
    const locn = $('#edit-locname').val();
    if (locn === '') {
        const toast = new bootstrap.Toast($('#alert-toast'))
        $('.toast-body').html('All fields are required.');
        toast.show()

    } else {
        $.ajax({
            type: 'POST',
            url: 'php/updateLocationById.php',
            data: {
                name: locn,
                id: id
            },
            dataType: 'json',
            success: res => {
                const toast = new bootstrap.Toast($('#success-toast'))
                $('.toast-body').html('Location successfully edited.');
                toast.show()
                $('#elm').modal('hide');
                getAllLocation();

            },
            error: (jqXHR, textStatus, errorThrown) => {
                const toast = new bootstrap.Toast($('#alert-toast'))
                $('.toast-body').html('Something went wrong, location was not edited.');
                toast.show()
            }
        })
    }

});

// setting the edit location modal before opening it
$('#elm').on('show.bs.modal', function (e) {

    $.ajax({
        url: "php/getLocationById.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {

            var resultCode = result.status.code

            if (resultCode == 200) {
                $('#edit-location-modal').html(result.data.location[0].name);
                $('#location-id').val(result.data.location[0].id);
                $('#edit-locname').val(result.data.location[0].name);

            } else {

                $('#epm .modal-title').replaceWith("Error retrieving data");

            } 

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#epm .modal-title').replaceWith("Error retrieving data");
        }
    });

})

// search functionality
$(document).on('submit', '#search-form', e => {
    e.preventDefault();
    q = $('#search-input').val();
    if ($('#select').val() === 'personnel') {
        if (q === '') {
            getAllPersonnel();
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/getPersonnelByName.php',
                data: {q: q},
                dataType: 'json',
                success: res => {
                    $('#personnel-list').empty();
                    for (let i=0; i<res.data.personnel.length; i++) {
                        addPersonnelToList(res.data.personnel[i].id,
                            res.data.personnel[i].firstName,
                            res.data.personnel[i].lastName,
                            res.data.personnel[i].jobTitle,
                            res.data.personnel[i].email,
                            res.data.personnel[i].departmentID,
                            res.data.personnel[i].depname,
                            res.data.personnel[i].locname);
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log(errorThrown);
                }
            });
        }
    } else if ($('#select').val() === 'department') {
        if (q === '') {
            getAllDepartment();
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/getDepartmentByName.php',
                data: {q: q},
                dataType: 'json',
                success: res => {
                    $('#department-list').empty();
                    for (let i=0; i<res.data.department.length; i++) {
                        addDepartmentToList(res.data.department[i].id,
                            res.data.department[i].name,
                            res.data.department[i].locationID,
                            res.data.department[i].locname)
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log(errorThrown);
                }
            });
        }
    } else {
        if (q === '') {
            getAllLocation();
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/getLocationByName.php',
                data: {q: q},
                dataType: 'json',
                success: res => {
                    $('#location-list').empty();
                    for (let i=0; i<res.data.location.length; i++) {
                        addLocationToList(res.data.location[i].id, res.data.location[i].name)
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log(errorThrown);
                }
            });
        }
    }
});

$('#show-all').on('click', () => {
    if ($('#select').val() === 'personnel') {
        getAllPersonnel();
    } else if ($('#select').val() === 'department') {
        getAllDepartment();
    } else {
        getAllLocation();
    }
})
