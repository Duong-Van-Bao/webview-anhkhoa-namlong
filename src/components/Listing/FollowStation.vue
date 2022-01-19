<template>
<div class="d-flex flex-row mb-3">
    <span class="d-block position-relative">
        <b-img :src="'http://imgsmartcity.namlongtekgroup.com/Stations/' + value.StationID + '.jpg'" :alt="'image_' + value.StationID" class="list-thumbnail border-0"/>
    </span>
    <div class="pl-3 pt-2 pr-2 pb-2">
        <span>
            <p class="list-item-heading">{{ value.StationName }}</p>
            <div class="pr-4">
                <p class="text-muted mb-1 text-small">{{ value.DescriptionWarning }}</p>
            </div>
            <div class="text-primary text-small font-weight-medium d-none d-sm-block">{{ value.UpdateTime }}</div>
        </span>
    </div>
</div>
</template>

<script>
export default {
    props: ['value']
}
</script>
