export interface MedicalBill {
    medical_bill_id?: string;
    medical_bill_health_record_id?: string;
    medical_bill_patient_name?: string;
    medical_bill_patient_id?: string;
    medical_bill_physician_name?: string;
    medical_bill_physician_id?: string;
    medical_bill_department_name?: string;
    medical_bill_room_name?: string;
    medical_bill_created_at?: string;
    medical_bill_created_by?: string;
    medical_bill_modified_at?: string;
    medical_bill_modified_by?: string;
    medical_bill_previous_result?: string;
    medical_bill_place_of_introduction?: string;
    medical_bill_reason_for_examination?: string;
    medical_bill_medical_history?: string;
    medical_bill_anamnesis?: string;
    medical_bill_diagnose?: string;
    medical_bill_appointment?: string;
    medical_bill_treatment?: string;
    medical_bill_is_completed?: boolean;
    medical_bill_health_insurance?: string;
    medical_bill_ordinal_number?: string;
    medical_bill_update_by?: string;
    vital_signs_temperature?: string;
    vital_signs_blood_pressure?: string;
    vital_signs_breathing?: string;
    vital_signs_pluse?: string;
    docType?: string;
}
