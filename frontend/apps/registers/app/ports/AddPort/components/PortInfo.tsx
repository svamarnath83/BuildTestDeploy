'use client';

import React from "react";
import { Input, Select, Textarea } from '@commercialapp/ui';

const serviceContacts = [
  "Pilot",
  "Towage",
  "Mooring",
  "Launch",
  "Customs",
  "Police",
  "Port auth",
  "Security",
];

export default function PortInfo() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Port Info</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Port:</label>
            <Input type="text" name="port" />
          </div>
          <div>
            <label className="block text-sm font-medium">Last updated:</label>
            <Input type="date" name="lastUpdated" />
          </div>
          <div>
            <label className="block text-sm font-medium">By:</label>
            <Input type="text" name="by" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Nearest airport:</label>
            <Input className="w-32" type="text" name="nearestAirport" />
            <label className="text-sm">Distance:</label>
            <Input className="w-20" type="number" name="airportDistance" />
            <span className="text-sm">Km.</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Nearest railway:</label>
            <Input className="w-32" type="text" name="nearestRailway" />
            <label className="text-sm">Distance:</label>
            <Input className="w-20" type="number" name="railwayDistance" />
            <span className="text-sm">Km.</span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 items-end">
          <div></div>
          <div className="text-xs font-semibold">VHF</div>
          <div className="text-xs font-semibold">Phone</div>
          <div className="text-xs font-semibold">Notice</div>
          <div></div>
          {serviceContacts.map((service) => (
            <React.Fragment key={service}>
              <div className="text-sm font-medium">{service}:</div>
              <Input type="text" name={`${service.toLowerCase()}Vhf`} />
              <Input type="text" name={`${service.toLowerCase()}Phone`} />
              <Input type="text" name={`${service.toLowerCase()}Notice`} />
              <div></div>
            </React.Fragment>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Pref. agent:</label>
            <Select name="prefAgent">
              <option value="">Select</option>
            </Select>
            <label className="block text-sm font-medium mt-2">Agent 1:</label>
            <Select name="agent1">
              <option value="">Select</option>
            </Select>
            <label className="block text-sm font-medium mt-2">Agent 2:</label>
            <Select name="agent2">
              <option value="">Select</option>
            </Select>
            <label className="block text-sm font-medium mt-2">Agent 3:</label>
            <Select name="agent3">
              <option value="">Select</option>
            </Select>
            <label className="block text-sm font-medium mt-2">Agent 4:</label>
            <Select name="agent4">
              <option value="">Select</option>
            </Select>
            <label className="block text-sm font-medium mt-2">JP Port PE:</label>
            <Select name="jpPortPe">
              <option value="">Select</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Comments:</label>
            <Textarea className="w-full h-24" name="comments" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">General Notes:</label>
          <Textarea className="w-full h-24" name="generalNotes" />
        </div>
      </form>
    </div>
  );
} 