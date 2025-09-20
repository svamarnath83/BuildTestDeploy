Here is your content converted to a clean, structured **Markdown (`.md`) format**, ready to be used with **Cursor AI** or other code-gen-aware tools:

---

````markdown
# Distance Calculation Logic

## 🧮 Triggering Distance Calculation

- Distance calculation is only triggered **manually**:
  - On **Ship Analysis Click**
  - On **Get Distance** button click

### 🧹 Pre-Calculation Cleanup

- **Before calculating distances**, if the distance status is **red** (missing distances) and **stale canals/routing points exist** in the rotation:
  - **Remove only stale routing points** (those without proper alternatives) from the schedule
  - **Clear all distances** from the schedule
  - **Then calculate fresh distances** and add appropriate canals/routing points based on new distance data
  - This ensures **clean slate** for distance calculation while **preserving user-selected routing points**

#### 🎯 **Pre-Calculation Cleanup Rules**
* **Trigger conditions**: 
  - Distance status is **red** (missing distances)
  - **AND** stale routing points exist (routing points without `availableAlternatives`)
* **Do NOT trigger** when:
  - User has just switched to alternate routing points (these have proper alternatives)
  - Routing points have `availableAlternatives` set up (indicating they're user-selected)
* **Purpose**: Remove only **stale routing points** that would interfere with new calculations, not user choices

---

## 📥 Sample Distance API Response

```json
[
    {
        "FromPort": "SINGAPORE",
        "ToPort": "OSLO",
        "Distance": 8928,
        "SecaDistance": 0,
        "RouteSegments": [
            {
                "FromPort": "SINGAPORE",
                "ToPort": "SUEZ CANAL (RP)",
                "Distance": 4997,
                "SecaDistance": 0
            },
            {
                "FromPort": "SUEZ CANAL (RP)",
                "ToPort": "OSLO",
                "Distance": 3931,
                "SecaDistance": 0
            }
        ],
        "RoutingPoints": [
            {
                "Name": "SUEZ CANAL (RP)",
                "AlternateRPs": [
                    {
                        "Name": "CAPE GOOD HOPE (RP)",
                        "AlternateRPs": []
                    }
                ]
            }
        ]
    },
    {
        "FromPort": "OSLO",
        "ToPort": "BERGEN",
        "Distance": 0,
        "SecaDistance": 0,
        "RouteSegments": [],
        "RoutingPoints": []
    }
]
````

---

## 🧠 Distance Assignment Rules

### Use Case 1: RouteSegments Processing
* If a port pair has `RouteSegments`, add them between the ports in the rotation
* Use the distances available in `RouteSegments` for each segment
* Each `RouteSegment` represents a leg of the journey with its own distance

### Use Case 2: RoutingPoints for Alternate Display
* Use `RoutingPoints` only to show `AlternateRPs` in the alt menu
* `RoutingPoints` are used for UI display of alternate routing options
* They do not directly add routing points to the rotation - that's handled by `RouteSegments`

## 🚫 Exception List Handling

* **Before adding a routing point** to the rotation, check if the routing point name is in the **ToPort's `exceptionList`**.
* If the routing point **is in the exception list**:
  - **Do not add** the original routing point
  - **Check for alternate routing points** in the same distance result
  - If an **alternate routing point exists** and has `AddToRotation == true`, add the **alternate** instead
  - If **no suitable alternate exists**, skip adding any routing point for this port pair
* This prevents **re-adding routing points** that were previously removed by the user

### 📋 Example Scenario: Singapore → Suez Canal → Dubai
* **Initial state**: Singapore → Suez Canal → Dubai
* **User action**: Switch Suez Canal to Cape of Good Hope alternate
* **Result**: 
  - Suez Canal is added to Dubai's ExceptionRPs
  - All distances are cleared
  - Route becomes: Singapore → Cape of Good Hope → Dubai
  - Cape of Good Hope has Suez Canal as an alternative (orange alternate icon)
* **On "Get Distance"**: 
  - Cape of Good Hope routing point is preserved (not removed by pre-calculation cleanup)
  - Cape of Good Hope maintains its orange alternate icon with Suez Canal as alternative
  - Suez Canal is NOT added (it's in Dubai's ExceptionRPs)
  - Route remains: Singapore → Cape of Good Hope → Dubai
* **User can switch back**: Use the orange alternate icon on Cape of Good Hope to switch back to Suez Canal

### 🔧 **Fixed Use Case: Preserving User-Selected Routing Points**
* **Issue**: When users switched to alternate routing points and clicked "Get Distance", the system was incorrectly removing the newly selected routing points during pre-calculation cleanup
* **Solution**: Enhanced pre-calculation cleanup logic to only remove **stale routing points** (those without proper alternatives), not user-selected routing points
* **Behavior**: 
  - User-selected routing points with proper alternatives are preserved during distance calculation
  - Only routing points without alternatives (indicating they're stale) are removed
  - This ensures that alternate icons remain functional after distance calculation

---

## 🔁 Alternate Routing Points (RP)

* If a `RoutingPoint` has one or more `AlternateRPs`, show an **icon** in the `Alt` column.
* On icon click:

  * Show a **popup** allowing the user to choose an alternate RP.
  * If user **selects** an alternate RP:

    * **Remove** the current Canal (original RP).
    * **Clear all distances** from the schedule (regardless of AddToRotation value).
    * If `AddToRotation == true` on the selected alternate RP:

      * Add it to the **Rotation**.
    * Else:

      * **Do not add** the RP to the rotation.
    * This ensures **clean slate** for distance calculation after route changes.
    * **Rationale**: When switching between routing alternatives, the overall route structure changes, which may affect distances between other port pairs. Clearing all distances forces a fresh distance calculation to ensure accuracy and consistency across the entire route.
    * **User Action Required**: After alternate route selection, the user must manually click the **"Get Distance"** button to recalculate all distances for the new route structure.

---

## ❌ Deletion Handling

* If a user deletes a `RoutingPoint`, add the **deleted RoutingPoint** to the **ToPort’s `exceptionList`**.

---

## ♻️ Auto-Clear Distance Rules

Clear distances in the following cases:

* On **Port Name change**
* On **New Port addition**
* On **Port deletion**
* On **Port position change**
* On **Alternate route selection** (when switching between routing point alternatives)

---

## 🛑 UI Restrictions

* **Load Port**, **Discharge Port**, and **Canal Port** inputs should be **disabled**.

  * The user **cannot change** these values manually.

---

## 🔍 UI Alerts

* If any Port Call is **missing a distance**, the **Get Distance** button should be **highlighted**.
* After **alternate route selection**, all distances are cleared and the **Get Distance** button should be **highlighted** to indicate that manual distance calculation is required.

## 🎯 **UI Behavior for Alternate Route Selection**

### 🔄 **Alternate Icon Behavior**
* **Orange alternate icon** appears in the "Alt" column for routing points with alternatives
* **Blue route selection icon** appears before port names only for main ports with available routing points
* **After switching alternatives**: 
  - New routing point should have orange alternate icon with original routing point as alternative
  - Original routing point is added to destination port's ExceptionRPs
  - All distances are cleared
  - User must manually click "Get Distance" to recalculate

### 🏷️ **Routing Point Labels**
* **Yellow labels** appear below routing point names when `AddToRotation` is false
* **Purpose**: Indicates that the routing point is not automatically added to the rotation
* **Visual Design**: Small yellow background with dark yellow text, positioned below the port name
* **Logic**: 
  - Primary check: `originalRoutingPoint.AddToRotation === false`
  - Fallback check: Current routing point in `availableAlternatives` has `AddToRotation === false`
* **User Benefit**: Helps users understand which routing points require manual intervention and won't be automatically included in future distance calculations

### 👁️ **Invisible Routing Point Indicators**
* **Gray labels** appear below main port names when a routing point with `AddToRotation=false` is being used for distance calculation but not added to the rotation
* **Yellow dots** appear on orange alternate icons when the current routing point has `AddToRotation=false`
* **Yellow dots** appear on blue route selection icons when a routing point with `AddToRotation=false` is available for that port pair
* **Blue dots** appear on blue route selection icons when a routing point with `AddToRotation=true` is being used
* **Tooltips** on orange alternate icons show "Currently using: [RP Name] (not in rotation)" when applicable
* **Tooltips** on blue route selection icons show "Currently using: [RP Name] (not in rotation)" when a routing point with `AddToRotation=false` is available
* **Tooltips** on blue route selection icons show "Currently using: [RP Name]" when a routing point with `AddToRotation=true` is being used
* **Purpose**: Makes invisible routing points visible to users so they understand which routing points are being used for distance calculations
* **Implementation**: 
  - `currentRoutingPoint` property added to `PortCall` model to track currently selected routing points
  - **Always set** on the destination port (ToPort) regardless of whether the routing point is visible or invisible
  - When a routing point with `AddToRotation=false` is selected, it's stored in the destination port's `currentRoutingPoint`
  - When a routing point with `AddToRotation=true` is added to rotation, it's also stored in the destination port's `currentRoutingPoint`
  - Tooltip logic checks `currentRoutingPoint.AddToRotation` to determine if an invisible routing point is being used
* **Visual Design**: 
  - Gray background with dark gray text for main port indicators
  - Small yellow dot on orange alternate icons
  - Small yellow dot on blue route selection icons (for invisible routing points)
  - Small blue dot on blue route selection icons (for visible routing points)
  - Informative tooltips on hover
* **User Benefit**: Users can see when routing points like Cape of Good Hope are being used for distance calculation even though they're not visible in the port rotation

### ✅ **Expected User Experience**
1. **Switch routing point**: Click orange alternate icon → select alternative → distances cleared
2. **Recalculate distances**: Click "Get Distance" button → routing point preserved with alternatives
3. **Switch back**: Click orange alternate icon on new routing point → select original → switch back
4. **Manual routing point addition**: Click blue route selection icon → select routing point → ExceptionRPs cleared for that routing point
5. **Consistent behavior**: Orange alternate icons remain functional throughout the process

### 🔧 **Manual Routing Point Addition**
* **Trigger**: User clicks blue route selection icon on a main port
* **Behavior**: 
  - Selected routing point is inserted before the destination port (or after source port)
  - If the selected routing point exists in the port's ExceptionRPs, it is **removed** from ExceptionRPs
  - The port's `availableRoutingPoints` are **cleared** after manual addition
  - This prevents the blue route selection icon from showing after the routing point is added
  - This allows the routing point to be automatically added in future "Get Distance" operations
* **Rationale**: When a user manually selects a routing point, they are explicitly choosing to include it, so it should no longer be blocked by ExceptionRPs and the UI should reflect that the action is complete

---

## 📊 **Data Model Changes**

### **PortCall Interface Updates**
```typescript
export interface PortCall {
  // ... existing properties ...
  currentRoutingPoint?: RoutingPoint; // Currently selected routing point for this port pair (even if not in rotation)
}
```

### **Implementation Details**
* **`currentRoutingPoint`**: New optional property that tracks the currently selected routing point for a port pair
* **Set when**: A routing point with `AddToRotation=false` is selected via the orange alternate icon
* **Stored on**: The destination port (ToPort) of the port pair
* **Used for**: Tooltip display on blue route selection icons to show which invisible routing point is being used
* **Cleared when**: The routing point is manually added to the rotation or a different routing point is selected

### **Example Usage**
```typescript
// When Cape of Good Hope (AddToRotation=false) is selected for Singapore → Dubai
dubaiPortCall.currentRoutingPoint = {
  Name: "CAPE OF GOOD HOPE",
  Distance: 33,
  AddToRotation: false
};
// Blue icon tooltip shows: "Currently using: CAPE OF GOOD HOPE (not in rotation)"
// Yellow dot appears on blue icon

// When Suez Canal (AddToRotation=true) is added to rotation for Singapore → Dubai
dubaiPortCall.currentRoutingPoint = {
  Name: "SUEZ CANAL",
  Distance: 33,
  AddToRotation: true
};
// Blue icon tooltip shows: "Currently using: SUEZ CANAL"
// Blue dot appears on blue icon
```

```

---
