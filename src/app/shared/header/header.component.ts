import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LanguageService } from 'src/app/core/services/language.service';
import * as INTERFACE from 'src/app/core/models/other-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/core/services/account.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { getSubmenuMockData } from 'src/app/core/services/utils.service'
import * as constants from 'src/app/core/config/const'
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';

@Component({
  selector: 'sica-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public items: MenuItem[] = []; // items que conformaran el nav de entidades
  selectedLanguage: INTERFACE.selectedOption; // variable donde el selector de idiomas guarda el idioma elegido
  selectedConcession: INTERFACE.selectedOption; // variable donde el selector de concesiones guarda la concesión elegida
  //variables donde se guardan las opciones de selectores
  languages: INTERFACE.OptionsSelector[];
  allowedConcessions: INTERFACE.OptionsSelector[];

  // booleano para hacer aparecer nav de concesiones si estamos en
  // reporting o en home de concesiones
  showRporting: boolean = true;

  // entidades permitidas según permisos
  allowedEntites: string[] = [];

  // nombre de usuario, recogido de permisos
  username: string;

  // nombre de la concesión
  labelConcessionName: string;

  //subscriptions:
  routeSubs$: Subscription = new Subscription();
  subsLan$: Subscription = new Subscription();
  subsTran$: Subscription = new Subscription();

  // Observable ante cambios de lengua en traducciones
  language$: Observable<string>;
  currentConcession: INTERFACE.OptionsSelector;
  chosenEntity: string = "";
  accountSettingsRoute: string = "";

  /**
   * A tener en cuenta que este componente se comparte en dos flujos:
   * - Home -> reporting
   * - concession -> concesiones
   * @param languageService
   * @param translate
   * @param router
   * @param route
   * @param accountService
   * @param dataTransferService
   * @param authService
   */
  constructor(
    private languageService: LanguageService,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private dataTransferService: DataTransferService,
    private authService: AuthService
  ) {
    // para cambiar lenguage dinámicamente en toda la aplicación, hay un  observable
    // ...
    this.language$ = this.languageService.watchLanguage();
    this.routeSubs$ = this.route.params.subscribe(value => {
      // si en la url existe el slug ':concesion' es el header de la home de concesion
      // el showReporting se pone a falso y permite que el nav de entidades se visualice
      // se conforma el accountService.permissions, que permitirá seleccionar las concesiones y
      // ... entidades según los permisos del usuario
      if (!!value['idConcession']) {
        //si accountService.Permissions está ya conformado se llama al getter
        if (this.accountService.cachedData()) this.accountService.getDataInNavigator();
        // ... si no se conforma el objeto
        else this.accountService.buildPermissionsObject();
        this.allowedConcessions = this.accountService.getAllowedConcessions();

        this.showRporting = false;
        this.accountService.setShowReporting(this.showRporting);
        this.currentConcession = this.allowedConcessions.find(concession => concession.value === value['idConcession']);
        if (!!this.currentConcession) this.dataTransferService.setIdConcession(this.currentConcession.id);
        this.selectedConcession = { value: this.currentConcession.value };
        this.labelConcessionName = this.currentConcession.name;
      } else {
        this.selectedConcession = { value: '' };
      }
      // se llama a método para hacer traducciones
      this.updatingtranslations();
    }
    );

  }

  ngOnInit(): void {
    this.initActions();
  }

  initActions() {
    this.accountSettingsRoute = "/" + constants.contextSlug.ADMIN + "/" + constants.ROUTING_USER_BASE.replace(":id", this.accountService.getIdUser().toString()) + "/" + constants.Actions.EDIT,
      this.username = this.accountService.getUserDataName();
    // de momento se coge el valor del lenguage de la librería que se definió por defecto en app.component
    this.selectedLanguage = { value: this.translate.currentLang };
    if (this.selectedConcession.value !== "") {
      this.allowedEntites = this.accountService.getAllowedEntitesByConcession(this.currentConcession.value);
    }
    this.globalLoadingValues();
  }

  /**cuando se cambia de concesion, se navega a nueva ruta */
  changeConcession() {
    let defineRoute = this.allowedConcessions.find((item) => item.value === this.selectedConcession.value).link;
    defineRoute = defineRoute.replace(":idConcession", this.selectedConcession.value)
    this.router.navigate([defineRoute]);
  }

  globalLoadingValues() {
    if (this.accountService.cachedData()) this.accountService.getDataInNavigator();
    else this.accountService.buildPermissionsObject();
    this.buildLanguagesItems();


    //se construyen las opciones de concesión para ese usuario
    this.allowedConcessions = this.accountService.getAllowedConcessions();



    this.buildEntities();
  }

  /**
  * Cambios de traducciones ante posibles cambios de lenguage
  */
  updatingtranslations() {
    this.subsLan$ = this.language$.subscribe(value => {
      this.subsTran$ =
        this.translate.use(value).subscribe(translation => {
          this.buildLanguagesItems();
          this.buildEntities();
        });
    });
  }

  /**
   * se coforman los items que llenaran las opciones del selector de idiomas
   */
  buildLanguagesItems() {
    this.languages = [
      { name: this.translate.instant('GENERAL.LANGUAGE_SELECTOR.SPANISH'), value: "es" },
      { name: this.translate.instant('GENERAL.LANGUAGE_SELECTOR.CATALAN'), value: "ca" }
    ];
  }

  /**
   * Cuando se cambia el selector de idioma, se pasa valor al servicio donde está el observable
   */
  changeLang() {
    this.languageService.setLanguage(this.selectedLanguage.value);
  }


  /**
   * se construyen los items del nav del header con las entidades según
   * la concesión y permisos obtenidos
   */
  buildEntities() {

    this.items = [];

    constants.HEADER_LINKS.forEach(element => {
      if (this.allowedEntites.includes(element.authEntitie)) this.items.push(
        {
           label: this.translate.instant(element.traduction), 
          routerLink: element.route.replace(":idConcession", this.selectedConcession.value) 
        }
      )
    });

    const adminMenu = this.getAdminMenu(this.selectedConcession.value);

    const testMenu = this.getTestMenu()
    if (adminMenu)
      this.items.push(adminMenu);

    if (testMenu)
      this.items.push(testMenu);

  }


  /**
   * se llama en el boton de salir de sesión
   */
  signOut() {
    this.authService.logout();
  }

  /**enruta a módulo de settings de user */
  goToAccount() {
    let userReferences: INTERFACE.entityConfigData = constants.ENTITY_REFERENCES.ACCOUNT;
    this.router.navigate(['/' + userReferences.routing_reference]);
  }

  get concessionSelected() {
    return this.selectedConcession.value !== "";
  }

  ngOnDestroy() {
    this.routeSubs$.unsubscribe();
    this.subsLan$.unsubscribe();
    this.subsTran$.unsubscribe();
  }


  getAdminMenu(idConcesion: string): MenuItem {
    if (idConcesion) {
      const permisisons = this.accountService.getPermissions().find(p => p.concessionCode === idConcesion);
      let menuItems: MenuItem = {
        label: this.translate.instant('GENERAL.MENU.BILLING.ADMIN'),
        routerLink: "/admin/sub-home",
        // items: []
      };

      // const concesion = this.getConcesionAdmin(idConcesion, permisisons);
      // if (concesion)
      //   menuItems.items.push(concesion);

      // const zones = this.getZonesAdmin(idConcesion, permisisons);
      // if (zones)
      //   menuItems.items.push(zones);

      // const users = this.getUsuariosAdmin(idConcesion, permisisons);
      // if (users)
      //   menuItems.items.push(users);

      // const roles = this.getRolesAdmin(idConcesion, permisisons);
      // if (roles)
      //   menuItems.items.push(roles);

      // const multilang = this.getMultilangAdmin(permisisons);
      // if (multilang)
      //   menuItems.items.push(multilang);

      // const masters = this.getMasters(permisisons);
      // if (masters)
      //   menuItems.items.push(masters);
        
      //   const processes = this.getProcesses(idConcesion, permisisons);
      //   if (processes)
      //   menuItems.items.push(processes);

      
      // const notificaciones = this.getNotificationAdmin(idConcesion, permisisons);
      // if(notificaciones)
      // menuItems.items.push(notificaciones);

      // return menuItems.items?.length ? menuItems : null;
      return menuItems;
    }
  }

  getConcesionAdmin(idConcesion: string, permisisons) {
    const item: MenuItem = {
      label: 'Concesiones',
      items: []
    }

    if (permisisons.concesion?.includes('edit')) {
      item.items.push(
        {
          label: 'Edición',
          routerLink: "/" + constants.contextSlug.CONCESSION +"/" + idConcesion + "/" + constants.ROUTING_REFERENCES.AJUSTES_CONCESION
        })
    }

    return item.items?.length > 0 ? item : null;
  }

  getZonesAdmin(idConcesion: string, permisisons) {
    if (permisisons.concesion?.includes('read')) {
      const item: MenuItem = {
        label: 'Zonas',
        routerLink: "/" + constants.contextSlug.CONCESSION +"/" + idConcesion + "/zonas"
      }

      return item;
    }

    return null;
  }

  getUsuariosAdmin(idConcesion: string, permisisons) {
    if (permisisons.account?.includes('read')) {
      const item: MenuItem = {
        label: 'Usuarios',
        routerLink: "/" + constants.contextSlug.CONCESSION +"/" + idConcesion + "/usuarios"
      }

      return item;
    }

    return null;
  }

  getRolesAdmin(idConcesion: string, permisisons) {
    if (permisisons.account?.includes('read')) {
      const item: MenuItem = {
        label: "Roles",
        routerLink: "/" + constants.contextSlug.CONCESSION +"/" + idConcesion + "/rols"
      }

      return item;
    }

    return null;
  }

  getMultilangAdmin(permisisons) {
    if (permisisons.global?.includes('read')) {
      const item: MenuItem = {
        label: "Multi Lenguage",
        routerLink:  '/'+ constants.contextSlug.ADMIN + "/" + constants.ROUTING_REFERENCES.MULTILENGUAGE +"/edit"
      }

      return item;
    }
    return null;
  }

  getMasters(permissions) {
    if (permissions.global?.includes('read')) {
      const item: MenuItem = {
        label: "Maestros",
        items: []
      }

      item.items.push(
        {
          label: 'Estado lecturas',
          routerLink: "/" + constants.contextSlug.ADMIN + "/" + constants.MASTERS_ROUTING_REFERENCES.ESTADO_LECTURAS
        },
        {
          label: 'divisas',
          routerLink: "/" + constants.contextSlug.ADMIN + "/" + constants.MASTERS_ROUTING_REFERENCES.DIVISAS
        })

      return item;
    }
    return null;
  }

  getProcesses(idConcesion, permissions) {
    if (permissions.global?.includes('read')) {
      const item: MenuItem = {
        label: "gestor procesos",
        items: []
      }

      item.items.push(
        {
          label: 'ejecución procesos',
          routerLink: "/" + constants.contextSlug.CONCESSION + "/"  + idConcesion + "/"  + constants.PROCESSES_ROUTING_REFERENCES.EXECUTION_PROCESSES
        })

      return item;
    }
    return null;
  }

  getTestMenu() {
    let menuItems: MenuItem = {
      label: 'Test',
      items: []
    };

    const access = this.getAccesMenu();
    if (access) menuItems.items.push(access);

    const paymentsCollections = this.getPaymentsCollectionsMenu();
    if (paymentsCollections) menuItems.items.push(paymentsCollections);


    return menuItems.items?.length ? menuItems : null;
  }

  getAccesMenu(): MenuItem {
    const item: MenuItem = {
      label: 'Acceso SalesForce',
      target: 'blank',
      url: "https://sica--des.lightning.force.com/lightning/r/Account/0015E00001cGCzMQAW/view"
    }
    return item;
  }

  getPaymentsCollectionsMenu(): MenuItem {
    const item: MenuItem = {
      label: 'Pagos-cobros',
      routerLink: "/" + constants.contextSlug.ADMIN + "/" + constants.ROUTING_REFERENCES.CONCILIATIONS
    }
    return item;
  }

  getNotificationAdmin(idConcesion: string, permisisons) {
    if(permisisons.account?.includes('read')) {
      const item: MenuItem = {
        label: "Notificacion",
        items: []
      }

      item.items.push(
        {
          label: 'No certificadas',
          routerLink: "/" + constants.contextSlug.CONCESSION + "/" + idConcesion + "/" + constants.ROUTING_REFERENCES.NOTIFICACIONES_ROOT + "/" + constants.ROUTING_NOTIFICATIONS_REFERENCES.NON_CERTIFICATE
        },
        {
          label: 'Certificadas',
          routerLink: "/" + constants.contextSlug.CONCESSION + "/" + idConcesion + "/" + constants.ROUTING_REFERENCES.NOTIFICACIONES_ROOT + "/" + constants.ROUTING_NOTIFICATIONS_REFERENCES.CERTIFICATE
        },
        )
    
      return item;
    }

    return null;
  }


}
