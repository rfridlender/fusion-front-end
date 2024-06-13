export function newAddress() {
    return {
        addressId: "",
        streetOne: "",
        streetTwo: null,
        city: "",
        county: null,
        state: "",
        postalCode: null,
        country: "",
        addressUpdatedBy: "",
        addressUpdatedAt: "",
    }
}

export function newBuilder() {
    return {
        builderId: "",
        builderName: "",
        contact: newPerson(),
        address: newAddress(),
        builderUpdatedBy: "",
        builderUpdatedAt: "",
    }
}

export function newDevelopment() {
    return {
        developmentId: "",
        developmentName: "",
        builder: newBuilder(),
        contact: newPerson(),
        address: newAddress(),
        developmentUpdatedBy: "",
        developmentUpdatedAt: "",
    }
}

export function newItem() {
    return {
        itemId: "",
        itemCategory: "",
        itemSubcategory: "",
        sku: "",
        itemDescription: null,
        unitOfMeasurement: "",
        priceBuilder: 0,
        priceHomeOwner: 0,
        cost: 0,
        vendorPartNumber: null,
        vendor: newVendor(),
        itemUpdatedBy: "",
        itemUpdatedAt: "",
    }
}

export function newLineItem() {
    return {
        lineItemId: "",
        lineNumber: 0,
        description: null,
        quantity: 0,
        priceUnit: 0,
        item: newItem(),
        project: newProject(),
        lineItemUpdatedBy: "",
        lineItemUpdatedAt: "",
        lineItemIsDeleted: false,
    }
}

export function newLineItemDepopulated() {
    return {
        lineItemId: "",
        lineNumber: 0,
        description: null,
        quantity: 0,
        priceUnit: 0,
        itemId: "",
        projectId: "",
        lineItemUpdatedBy: "",
        lineItemUpdatedAt: "",
        lineItemIsDeleted: false,
    }
}

export function newLot() {
    return {
        lotId: "",
        lotNumber: "",
        address: newAddress(),
        development: newDevelopment(),
        contact: newPerson(),
        lotUpdatedBy: "",
        lotUpdatedAt: "",
    }
}

export function newPerson() {
    return {
        personId: "",
        givenName: "",
        familyName: "",
        phoneNumber: null,
        email: null,
        personUpdatedBy: "",
        personUpdatedAt: "",
    }
}

export function newProject() {
    return {
        projectId: "",
        projectCategory: "",
        installDate: "",
        customerPurchaseOrderNumber: null,
        salesOrderNumber: null,
        lot: newLot(),
        contact: newPerson(),
        representative: newPerson(),
        warehouse: newWarehouse(),
        lineItems: [],
        projectUpdatedBy: "",
        projectUpdatedAt: "",
        projectIsDeleted: false,
    }
}

export function newVendor() {
    return {
        vendorId: "",
        vendorName: "",
        contact: newPerson(),
        address: newAddress(),
        vendorUpdatedBy: "",
        vendorUpdatedAt: "",
    }
}

export function newWarehouse() {
    return {
        warehouseId: "",
        warehouseName: "",
        address: newAddress(),
        warehouseUpdatedBy: "",
        warehouseUpdatedAt: "",
    }
}
