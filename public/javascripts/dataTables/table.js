$(document).ready(function() {
    var table = $('#dataTables').DataTable({});
    table.destroy();
    if ($.fn.dataTable.isDataTable('#dataTables')) {
        table = $('#dataTables').DataTable();
    } else {
        table = $('#dataTables').DataTable({
            paging: true
        });
    }
    var aux = $('.delete')[1];
    console.log(aux);
    aux.remove();
});