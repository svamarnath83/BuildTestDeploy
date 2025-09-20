"use client"

import React from 'react'
import { AuditLogList } from '../audit/AuditLogList'

export function AuditLogDemo() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Audit Log Demo</h2>
        <p className="text-sm text-gray-600">Showing audit logs for a sample record</p>
      </div>
      
      <AuditLogList 
        moduleId="ESTIMATE"
        recordId={123}
        className="flex-1"
      />
    </div>
  )
}
