<template>
  <v-toolbar
    flat
    style="overflow-x:auto; white-space: nowrap;"
  >
    <v-btn
      text
      to="/equipamento"
    >
      <v-icon class="material-icons-outlined mr-2">
        info
      </v-icon>
      Equipamentos
    </v-btn>
    <v-btn
      text
      to="/veiculo"
    >
      <v-icon class="material-icons-outlined mr-2">
        widgets
      </v-icon>
      Veiculos
    </v-btn>
    <v-btn
      text
      to="/contrato"
    >
      <v-icon class="material-icons-outlined mr-2">
        description
      </v-icon>
      Contrato
    </v-btn>
    <v-btn
      text
      to="/servico"
    >
      <v-icon class="material-icons-outlined mr-2">
        folder
      </v-icon>
      Serviços
    </v-btn>
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="material-icons-outlined mr-2">
            checklist
          </v-icon>
          Item Serviços
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item to="/item-servico">
          <v-list-item-title>Itens do Serviço</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      text
      to="/cliente"
    >
      <v-icon class="material-icons-outlined mr-2">
        people
      </v-icon>
      Clientes
    </v-btn>
    <v-btn
      text
      to="/funcionario"
    >
      <v-icon class="material-icons-outlined mr-2">
        group
      </v-icon>
      Funcionários
    </v-btn>
  </v-toolbar>
</template>
  
  <script>
  export default {
      name: 'SToolbar'
  }
  </script>
  
  <style lang="scss" scoped>
  .v-btn {
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
  }
  </style>