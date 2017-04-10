(function(window, $, undefined) {

	$(document).ready( function() {

		// Select2 Enhancement if it exists
		if ( $().select2 ) {
			var wc_address_book_select_select2 = function() {
				$( 'select#shipping_address:visible, select#address_book:visible' ).each( function() {
					$( this ).select2();
				});
			};

			wc_address_book_select_select2();
		}

		/*
		 * AJAX call to delete address books.
		 */
		$('.address-book .wc-address-book-delete').click( function( e ) {

			e.preventDefault();

			$(this).closest( '.wc-address-book-address' ).addClass('blockUI blockOverlay wc-updating');

			var name = $(this).attr('id');

			$.ajax({
				url : wc_address_book.ajax_url,
				type : 'post',
				data : {
					action : 'wc_address_book_delete',
					name : name
				},
				success : function( response ) {
					$('.wc-updating').remove();
				}
			});
		});

		/*
		 * AJAX call to switch address to primary.
		 */
		$('.address-book .wc-address-book-make-primary').click( function( e ) {

			e.preventDefault();

			var name = $(this).attr('id');
			var primary_address = $('.woocommerce-Addresses .u-column2.woocommerce-Address address');
			var alt_address = $(this).parent().siblings( 'address' );

			// Swap HTML values for address and label
			var pa_html = primary_address.html();
			var aa_html = alt_address.html();

			alt_address.html(pa_html);
			primary_address.html(aa_html);

			primary_address.addClass('blockUI blockOverlay wc-updating');
			alt_address.addClass('blockUI blockOverlay wc-updating');

			$.ajax({
				url : wc_address_book.ajax_url,
				type : 'post',
				data : {
					action : 'wc_address_book_make_primary',
					name : name
				},
				success : function( response ) {
					$('.wc-updating').removeClass('blockUI blockOverlay wc-updating');
				}
			});
		});

		/*
		 * AJAX call display address on checkout when selected.
		 */
		function shipping_checkout_field_prepop() {

			var that = $('#address_book_field #address_book');
			var name = $(that).val();

			if ( name !== undefined ) {
				
				if ( name.length > 0 ) {

					$(that).closest( '.shipping_address' ).addClass( 'blockUI blockOverlay wc-updating' );

					$.ajax({
						url : wc_address_book.ajax_url,
						type : 'post',
						data : {
							action : 'wc_address_book_checkout_update',
							name : name
						},
						dataType: 'json',
						success : function( response ) {

							$('#shipping_address_1').val(response.shipping_address_1);
							$('#shipping_address_2').val(response.shipping_address_2);
							$('#shipping_city').val(response.shipping_city);
							$('#shipping_company').val(response.shipping_company);
							$('#shipping_country').val(response.shipping_country).change();
							$("#shipping_country_chosen").find('span').html(response.shipping_country_text);
							$('#shipping_first_name').val(response.shipping_first_name);
							$('#shipping_last_name').val(response.shipping_last_name);
							$('#shipping_postcode').val(response.shipping_postcode);
							$('#shipping_state').val(response.shipping_state);
							var stateName = $('#shipping_state option[value="'+response.shipping_state+'"]').text();
							$("#s2id_shipping_state").find('.select2-chosen').html(stateName).parent().removeClass('select2-default');

							$( '.shipping_address' ).removeClass('blockUI blockOverlay wc-updating');

						}
					});
					
				}
			}
		}

		shipping_checkout_field_prepop();

		$('#address_book_field #address_book').change( function() {
			shipping_checkout_field_prepop();
		});
	});

})(window, jQuery);