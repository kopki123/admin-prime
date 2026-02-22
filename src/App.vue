<template>
  <RouterView />

  <ConfirmDialog :draggable="false" />
  <DynamicDialog />
  <Toast position="top-center" />
</template>
