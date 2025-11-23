export interface OrderDictionary {
  order_form: {
    title: string
    subtitle: string
    kitchen_required: string
    order_id: string
    order_date: string
    notes: string
    dish_information: string
    add_dish: string
    add_supplementary_food: string
    select_dish: string
    portions: string
    quantity: string
    standard: string
    unit: string
    actions: string
    edit: string
    delete: string
    save: string
    cancel: string
    confirm_delete_dish: string
    confirm_delete_supplementary: string
    select_dish_and_portions: string
    select_ingredient_and_quantity: string
    all_ingredients_exist: string
    edit_after_add: string
    validation: {
      enter_order_id: string
      select_kitchen: string
      add_dish_or_food: string
    }
  }
  orders_list: {
    title: string
    search_placeholder: string
    no_orders: string
    no_orders_match_filters: string
    table_headers: {
      order_id: string
      kitchen: string
      order_date: string
      status: string
      created_by: string
      details_count: string
      actions: string
    }
    actions: {
      view_details: string
      view_ingredients: string
      view_supplier_requests: string
      delete_order: string
    }
    status_badges: {
      pending: string
      approved: string
      completed: string
      cancelled: string
      rejected: string
    }
  }
  ingredient_summary: {
    title: string
    subtitle: string
    no_ingredients: string
    table_headers: {
      ingredient: string
      quantity: string
      unit: string
    }
    suppliers: {
      title: string
      select_supplier: string
      no_supplier: string
      no_supplier_price: string
      select_supplier_required: string
      best_price: string
      favorite: string
      suggestion: string
      best_suggestion: string
    }
    actions: {
      save_order: string
      processing: string
      refresh_suggestions: string
      save_all_selected: string
      saving: string
    }
    messages: {
      supplier_saved_one: string
      supplier_saved_bulk: string
      supplier_save_failed: string
      supplier_save_none_selected: string
    }
  }
  dish_row: {
    portions: string
    ingredients: string
    view_ingredients: string
    edit: string
    delete: string
  }
  dish_list: {
    title: string
    no_dishes: string
    add_dish: string
    portions_for_all: string
    table_headers: {
      dish: string
      portions: string
      ingredients: string
    }
  }
  supplementary_food_row: {
    quantity: string
    edit: string
    delete: string
  }
  common: {
    loading: string
    no_data: string
    error: string
    success: string
    confirm: string
    close: string
    search: string
    select: string
    selected: string
    add: string
    to: string
    total: string
  },
  orders: {
    labels: {
      supplier_requests_title: string
      supplier_requests_subtitle: string
      view_order: string
      back_to_orders: string
      zalo: string
      copy_to_clipboard_success: string
      no_supplier_requests: string
    }
    table_headers: {
      selection_id: string
      ingredient: string
      supplier: string
      quantity: string
      unit_price: string
      total_cost: string
      selected_by: string
      selection_date: string
      actions: string
    }
    status_badges: {
      pending: string
      approved: string
      completed: string
      cancelled: string
      rejected: string
    }
    loading: string
    zalo_message: {
      header: string
      ingredients_list: string
      ingredient_line: string
      notes: string
      footer: string
    }
  }
}
