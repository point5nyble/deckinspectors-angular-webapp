export enum OrchestratorEventName {

  Application_State_change = 'application_state_change',
  SHOW_SCREEN = 'show_project_details',


  Left_Tree_Data = 'left_tree_data',
  UPDATE_LEFT_TREE_DATA = 'update_left_tree_data',

  // Previous Button Logic
  Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC = 'add_element_to_previous_button_logic',
  REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC = 'remove_element_from_previous_button_logic',
  // This event is used to update state of project such as invasive or visual
  PROJECT_STATE_UPDATE = 'project_state_update',
  SECTION_CLICKED = 'section_clicked',
  // This event is used to update invasive button disable status
  INVASIVE_BTN_DISABLED = 'invasive_btn_disabled',

  // TODO - Remove Unused Event

  Previous_Button_Click = 'previous_button_click',
}
