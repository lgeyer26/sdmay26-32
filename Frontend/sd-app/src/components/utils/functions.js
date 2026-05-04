import React from 'react'
import { toast } from 'react-toastify';

export function showToast(message, type = "info") {
    toast(message, { type });
}